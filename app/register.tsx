import { Image, StyleSheet } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PrimaryTextInput } from "@/components/PrimaryTextInput";
import { useRef } from "react";
import { Field, FieldProps, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { SolidButton } from "@/components/SolidButton";
import { router } from "expo-router";
import { useApi } from "@/hooks/useApi";

interface RegisterValues {
  username: string;
  password: string;
}

const registerSchema = Yup.object().shape({
  username: Yup.string().trim().required("Username is required."),
  password: Yup.string()
    .required("Please enter your password.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number, and one special character."
    ),
});

export default function RegisterScreen() {
  const formikRef = useRef<FormikProps<RegisterValues>>(null);
  const { register } = useApi();

  const handleRegister = async (values: RegisterValues) => {
    try {
      const response = await register(values);
      alert(response?.message);
      formikRef.current?.resetForm();
      router.navigate("/", { relativeToDirectory: true });
    } catch (error) {
      alert(error?.response?.data?.error || "An unexpected error occurred.");
    }
  };

  const renderField = (
    name: keyof RegisterValues,
    placeholder: string,
    secureTextEntry?: boolean
  ) => (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <>
          <PrimaryTextInput
            placeholder={placeholder}
            onChangeText={field.onChange(name)}
            value={field.value}
            onBlur={field.onBlur(name)}
            secureTextEntry={secureTextEntry}
          />

          {meta.touched && meta.error && (
            <ThemedText type="default" style={styles.errorText}>
              {meta.error}
            </ThemedText>
          )}
        </>
      )}
    </Field>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <Formik
        innerRef={formikRef}
        validateOnChange
        validateOnBlur
        onSubmit={handleRegister}
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={registerSchema}
      >
        {({ handleSubmit }) => (
          <>
            <ThemedText type="title">Register</ThemedText>

            <ThemedText type="subtitle">Username</ThemedText>
            {renderField("username", "Type your username...")}

            <ThemedText type="subtitle">Password</ThemedText>
            {renderField("password", "Type your password...", true)}

            <SolidButton onPress={handleSubmit} label="Register" />
          </>
        )}
      </Formik>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  errorText: {
    color: "red",
  },
});
