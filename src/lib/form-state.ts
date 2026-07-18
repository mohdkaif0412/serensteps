// Client-safe form-action state (no server imports), shared by server actions
// and the client forms that call them via useActionState.
export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialFormState: FormState = { ok: false };
