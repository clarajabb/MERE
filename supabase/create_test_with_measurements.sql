-- Saves one test and all of its measurements in a single transaction.
-- If any insert fails, nothing is saved.
--
-- SECURITY INVOKER: runs as the signed-in user, so existing RLS policies and
-- verification triggers apply exactly as they do to direct inserts.
--
-- Requires harden_validate_measurement_material.sql to be applied first. With an
-- empty search_path, the original trigger cannot find its unqualified "tests".

create or replace function public.create_test_with_measurements(
  p_material_id uuid,
  p_test jsonb,
  p_measurements jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_test_id uuid;
begin
  if p_measurements is null
     or jsonb_typeof(p_measurements) <> 'array'
     or jsonb_array_length(p_measurements) = 0 then
    raise exception 'A test must include at least one measurement'
      using errcode = '22023';
  end if;

  if jsonb_array_length(p_measurements) > 50 then
    raise exception 'A test can have at most 50 measurements (received %)',
      jsonb_array_length(p_measurements)
      using errcode = '22023';
  end if;

  -- verification_status is fixed here and is never read from the input.
  insert into public.tests (
    material_id,
    laboratory_id,
    report_number,
    lab_sample_id,
    test_date,
    sample_received_date,
    notes,
    verification_status
  )
  values (
    p_material_id,
    (p_test ->> 'laboratory_id')::uuid,
    p_test ->> 'report_number',
    p_test ->> 'lab_sample_id',
    (p_test ->> 'test_date')::date,
    (p_test ->> 'sample_received_date')::date,
    p_test ->> 'notes',
    'PENDING_REVIEW'::public.verification_status
  )
  returning id into v_test_id;

  -- material_id, test_id and verification_status are also never read from the input.
  insert into public.measurements (
    material_id,
    test_id,
    metric_id,
    value_numeric,
    value_text,
    value_boolean,
    unit,
    test_method,
    test_standard,
    source_type,
    notes,
    verification_status
  )
  select
    p_material_id,
    v_test_id,
    (m ->> 'metric_id')::uuid,
    (m ->> 'value_numeric')::numeric,
    m ->> 'value_text',
    (m ->> 'value_boolean')::boolean,
    m ->> 'unit',
    m ->> 'test_method',
    m ->> 'test_standard',
    (m ->> 'source_type')::public.source_type,
    m ->> 'notes',
    'PENDING_REVIEW'::public.verification_status
  from jsonb_array_elements(p_measurements) as m;

  return v_test_id;
end;
$$;

revoke all on function public.create_test_with_measurements(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.create_test_with_measurements(uuid, jsonb, jsonb) to authenticated;
