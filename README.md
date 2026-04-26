# Toshizo Home Page

This repository contains the private home page for Toshizo, featuring a static website with multiple detail pages, custom animations, images, and a PHP contact form.

## Features

- Responsive landing page (`index.html`)
- Detail pages for "Tomoribi" and "Tsutsuura"
- In-page contact form with PHP mail delivery (`index.html#contact`, `contact-submit.php`)
- Custom CSS styling and animations
- Team member images and service logos
- Screenshots for documentation
- No external dependencies required

## File Structure

- `index.html` — Main landing page
- `contact.html` — Redirects old contact links to `index.html#contact`
- `contact-submit.php` — Contact form mail handler
- `tomoribi-detail.html`, `tsutsura-detail.html` — Detail pages
- `styles.css` — Main stylesheet
- `animations.js`, `contact.js` — JavaScript for animations and form handling
- `campfire-service-logo.png`, `icon.png`, `tomoribi.png`, `tsutsuura.png` — Images and logos
- `member1.jpg`, `member2.jpg`, `member3.jpg`, `member4.jpg` — Team member images
- `Kaisotai-Next-UP-B.woff2` — Web font
- `screenshot1.PNG`, `screenshot2.PNG`, `screenshot3.PNG` — Screenshots of the website

## Viewing Locally

1. Clone this repository (access required).
2. Open `index.html` in your web browser to view the home page.
3. Navigate to the detail pages via the links or open them directly.

No build step is required. PHP mail delivery requires a PHP-capable server.

## Deployment

Upload all files in this repository to the same directory on your web server.

Requirements:

- PHP with `mbstring` enabled
- Postfix or another MTA configured so `mb_send_mail()` can deliver mail
- `index.html` and `contact-submit.php` must live in the same public directory

Mail settings are defined at the top of `contact-submit.php`:

- `CONTACT_TO` — recipient address
- `CONTACT_FROM` — sender address used in the mail header
- `CONTACT_RETURN_PATH` — envelope sender used with `-f`
- `CONTACT_REDIRECT_URL` — page to return to after non-JavaScript form submission
- `CONTACT_REDIRECT_FRAGMENT` — page section to return to after non-JavaScript form submission

Recommended server checks after upload:

1. Submit the contact form once and confirm mail arrives at the recipient address.
2. If mail does not arrive, inspect the mail log on the server.
3. Make sure `CONTACT_FROM` and `CONTACT_RETURN_PATH` use an address allowed by your domain/server setup.
4. If your host blocks PHP mail, switch the handler to SMTP with PHPMailer instead of `mb_send_mail()`.

## Notes

- This repository is private and not intended for public distribution.
- All assets are for internal use only.
