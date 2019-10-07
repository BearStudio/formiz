export const FieldsStep3 = () => `
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
