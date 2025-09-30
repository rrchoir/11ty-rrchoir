
# Eleventy RRChoir

Website for the Rapid Response Choir, v2, https://rapidresponsechoir.org / https://rrchoir.org (or, pre-launch, at https://beta.rrchoir.org).

Builds a fast, pre-generated HTML website using the [Eleventy](https://www.11ty.dev/) static site generator. With [Decap CMS](https://www.decapcms.org/) (formerly Netlify CMS) baked-in, deployed to [Netlify](https://www.netlify.com).

Derived from the [Eleventy Netlify Boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate/) by Dan Urbanowicz.

# Managing content

## Songs


Sample metadata:

| field | example | usage|
|-------|---------|------|
| title | Heart Wide Open | Title or first line |
| category | general | only one category from a drop-down (see below) |
| credits | Lea Morris (2020) | composers, lyricists, parodists |
| hints |   Pitch G | pitch / meter / key -- details go in `notes` |
| notes | Begin with tenors on the melody. | Longer description of performance or context notes |
| tags | 21stC, de-escalation, faith | List of content purposes and musical characteristics |
| audience_participation | low | Can we expect the audience to sing along with some guidance? |
| ease_of_learning | easy | How quickly can the RRC pick it up (syncopation, melody, language)? |
| resources | `[Bandcamp recording](https://thisisleamusic.bandcamp.com/track/heart-wide-open)` | List of links to recordings or PDFs |

**Category**: TKTK

**Resources**:

* Bandcamp is preferred since there are no ads
* Recordings of the RRC are great too
* Spotify, Apple, and YouTube links help build song lists for practice


## Local development

### 1. Clone this repository:

### 2. Navigate to the directory

### 3. Install dependencies locally

```
npm install @11ty/eleventy
```

### 4. Edit _data/metadata.json

This file contains your site title and author details, and can be used to store any other commonly used site data.

### 5. Run Eleventy (builds the site)

```
npx @11ty/eleventy
```

Or build automatically when a template changes:
```
npx @11ty/eleventy --watch
```

Or build and host locally for local development:
```
npx @11ty/eleventy --serve
```

Or in debug mode:
```
DEBUG=* npx @11ty/eleventy
```

## Tracking Development

Our GitHub [Project for Site Management](https://github.com/orgs/rrchoir/projects/1)


This is an ongoing project and I welcome contributions and suggestions! Feel free to submit a PR.

If you need any help with setting up Decap CMS, you can reach out to the Netlify team in the [Decap CMS Gitter](https://gitter.im/netlify/netlifycms).
