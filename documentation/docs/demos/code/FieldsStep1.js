export const FieldsStep1 = (withValues) => `
            <MyField
              name="name"
              label="Name"
              required="Name is required"
              ${withValues ? 'defaultValue="Hailey Terry"' : ''}
            />

            <MyField
              name="nickname"
              label="Nickname"
              ${withValues ? 'defaultValue="hailey"' : ''}
            />
`;
