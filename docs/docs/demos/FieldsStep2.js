export const FieldsStep2 = withValues => `
            <MyField
              name="email"
              label="Email"
              type="email"
              isRequired="Email is required"
              validations={[
                {
                  rule: validations.isEmail(),
                  message: 'Not a valid email',
                }
              ]}
              ${withValues ? 'defaultValue="hailey@company.com"' : ''}
            />
`;
