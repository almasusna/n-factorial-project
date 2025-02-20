import { createFileRoute } from "@tanstack/react-router";
import type { FieldApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { signIn, useTokenStore } from "../util/store";
import { signIn as signInStorage, getToken } from "../util/auth";
import axios from "axios";

function FieldInfo<TField extends "username" | "password">({
  field,
}: {
  field: FieldApi<{ username: string; password: string }, TField>;
}) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-red-500 text-xs italic">
          {field.state.meta.errors.join(",")}
        </p>
      ) : null}
      {field.state.meta.isValidating ? (
        <p className="text-black-500 text-xs italic">Validating...</p>
      ) : null}
    </>
  );
}

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const tokenState = useTokenStore((state) => state.token);
  const tokenLocalStorage = getToken();
  const mutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) => {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      return axios.post(
        "https://api.myfinancetracker.online/api/v1/login/access-token",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    },
  });
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      mutation.mutate(values.value, {
        onSuccess: (data) => {
          console.log(data);
          signIn(data.data.access_token);
          signInStorage(data.data.access_token);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    },
  });
  return (
    <>
      {/* <h2>Token Localstorage: {tokenLocalStorage}</h2>
      <h2>Token State: {tokenState}</h2> */}
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="w-full max-w-xs">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="mb-4">
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Username is required"
                      : value.length < 3
                        ? "Username must be at least 3 characters"
                        : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return value.includes("error")
                      ? 'Username cannot contain "error"'
                      : undefined;
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor={field.name}
                      >
                        First Name:{" "}
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Password is required"
                      : value.length < 3
                        ? "Password must be at least 3 characters"
                        : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return value.includes("error")
                      ? 'Password cannot contain "error"'
                      : undefined;
                  },
                }}
                children={(field) => {
                  return (
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor={field.name}
                      >
                        Password:{" "}
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? "..." : "Submit"}
                    </button>
                    <button
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      type="reset"
                      onClick={() => form.reset()}
                    >
                      Reset input data
                    </button>
                  </div>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
