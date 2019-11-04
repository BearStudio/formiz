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
                  rule: (value) => myForm.values.password === value,
                  deps: [myForm.values.password],
                  message: 'Passwords do not match',
                }
              ]}
            />
`;
