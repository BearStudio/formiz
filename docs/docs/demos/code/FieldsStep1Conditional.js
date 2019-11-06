export const FieldsStep1 = withValues => `
            {isFieldNameVisible && (
              <MyField
                name="name"
                label="Name"
                isRequired="Name is required"
                ${withValues ? 'defaultValue="Hailey Terry"' : ''}
                keepValue
              />
            )}

            <MyField
              name="nickname"
              label="Nickname"
              ${withValues ? 'defaultValue="hailey"' : ''}
            />
`;
