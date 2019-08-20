export const FieldsStep2 = `
            <MyField
              name="email"
              label="Email"
              type="email"
              validations={[
                {
                  rule: validations.isEmail(),
                  message: 'Not a valid email',
                }
              ]}
            />
            <MyField
              name="password"
              label="Password"
              type="password"
              isRequired="Password is required"
            />
            <MyField
              name="passwordConfirm"
              label="Confirm password"
              type="password"
              isRequired="Confirm password is required"
              validations={[
                {
                  rule: (value, values) => values.password === value,
                  message: 'Passwords do not match',
                }
              ]}
            />
`;
