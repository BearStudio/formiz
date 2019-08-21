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

            <MyField
              name="password"
              label="Password"
              type="password"
            />
            <MyField
              name="passwordConfirm"
              label="Confirm password"
              type="password"
              validations={[
                {
                  rule: (value, values) => values.password === value,
                  message: 'Passwords do not match',
                }
              ]}
            />
`;
