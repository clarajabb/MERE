-- Same logic as the existing trigger function. Only two things change:
-- "tests" becomes "public.tests", and the function sets its own search_path.
-- Existing triggers stay attached, because the function is replaced in place.

create or replace function public.validate_measurement_material()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if not exists (
    select 1
    from public.tests
    where public.tests.id = new.test_id
      and public.tests.material_id = new.material_id
  ) then
    raise exception 'Measurement material_id must match the material_id of its test';
  end if;

  return new;
end;
$function$;
