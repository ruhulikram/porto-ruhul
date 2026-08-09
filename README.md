# Ruhul Ikram Portfolio

A custom single-page portfolio built around an iOS-inspired student desk. The site combines interactive folder assets, project case files, work history, education, and contact details in a responsive static experience.


## Stack

- Semantic HTML
- Custom responsive CSS
- Vanilla JavaScript
- GSAP and ScrollTrigger for motion
- Self-hosted Geist variable font
- Optimized WebP images

No build step or frontend framework is required.

## Project Structure

```text
porto-ruhul/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- assets/
|   |-- fonts/
|   |-- images/
|   |   |-- backgrounds/
|   |   |-- butterfly/
|   |   |-- folder-ui/
|   |   `-- projects/
|   |-- butterfly/       Original editable butterfly assets
|   |-- folder/          Original editable folder assets
|   |-- bg-desk.png      Original background source
|   `-- photo-utama.jpg  Original illustration source
|-- robots.txt
`-- sitemap.xml
```

Files under `assets/images/` are optimized runtime assets used by the website. The original PNG, SVG, and JPEG files remain available as editable source material.

## Local Preview

Run a static server from the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173` in a browser.

## Customizing Projects

Search `index.html` for `CUSTOMIZE`. Those comments identify the project screenshots, URLs, and samples that should be replaced when final case-study material is available.

Keep project claims factual. Replace the generated previews with approved screenshots before presenting client work as a completed case study.

## Image Workflow

Edit the original assets, then regenerate the optimized copies under `assets/images/`. For example:

```powershell
npx --yes sharp-cli -i "assets/photo-utama.jpg" -o "assets/images/projects/photo-utama.webp" -f webp -q 84 resize 1200 1200
```

Always update intrinsic `width` and `height` attributes in `index.html` when an image's dimensions change.

## Deployment

The site is compatible with GitHub Pages and can be published directly from the repository root. The canonical production URL is:

`https://ruhulikram.github.io/porto-ruhul/`

Update the canonical URL, Open Graph metadata, `robots.txt`, and `sitemap.xml` together if the production domain changes.

## Privacy

`more.txt` is intentionally ignored because it contains private resume information. Do not commit personal addresses or other non-public data to this repository.

## Font License

Geist is distributed under the SIL Open Font License 1.1. The license is included at `assets/fonts/OFL.txt`.

