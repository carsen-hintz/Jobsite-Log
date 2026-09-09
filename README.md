# Branded auth emails

Six templates matching the Carsen Hintz Software Development brand, for the
emails Supabase sends on your behalf.

## Before you paste them in

**Upload `email-logo.png` to your repo root**, next to `index.html`. Email
clients fetch the logo over the internet, so it has to sit at a public URL.
The templates point at:

```
https://carsen-hintz.github.io/Jobsite-Log/email-logo.png
```

If your app ever moves to `app.carsens-software-development.com`, update that
URL inside each template — search for `email-logo.png`.

## Installing each one

Supabase → **Authentication** → **Emails** → **Templates** → pick a template →
paste the HTML into the message body → set the subject → **Save**.

| Template in Supabase | File | Suggested subject |
|---|---|---|
| Reset password | `reset-password.html` | Set a new Jobsite Log password |
| Invite user | `invite-user.html` | You have been added to Jobsite Log |
| Confirm sign up | `confirm-signup.html` | Confirm your email address |
| Magic link or OTP | `magic-link.html` | Your Jobsite Log sign-in link |
| Change email address | `change-email.html` | Confirm your new email address |
| Reauthentication | `reauthentication.html` | Your Jobsite Log verification code |

## Which ones actually get used

With signups turned off and accounts created by hand, only two matter:

- **Reset password** — the one your customers will hit. Do this one first.
- **Invite user** — if you switch to inviting people instead of setting their
  passwords yourself. Worth having ready.

The other four are set up so nothing unbranded can go out if a flow you have
not planned for fires.

## Placeholders

Supabase fills these in when it sends. Do not rename them.

- `{{ .ConfirmationURL }}` — the link the button points at
- `{{ .Token }}` — a six-digit code (used in Reauthentication)
- `{{ .Email }}` / `{{ .NewEmail }}` — used in Change email address

If a placeholder shows up blank in a test email, check Supabase's template
docs for that specific template — the available variables differ per template.

## Why they look plainer than the app

Email clients are not browsers. No flexbox, no grid, no web fonts, and Outlook
ignores most modern CSS. These use tables, inline styles and a system font
stack, which is the only thing that renders reliably everywhere. Brand comes
through in the black header, the logo and the blue button rather than in
typography.

Images are also blocked by default in a lot of clients, so every template
reads correctly with the logo missing — the alt text carries your name.

## Testing

Send a real one: **Authentication** → **Users** → pick a user → **⋯** → send a
password recovery email, to an address you can check. Then look at Resend's
**Emails** log, which shows the delivery attempt and any rejection reason.

Check it on a phone. That is where your crews will read it.
