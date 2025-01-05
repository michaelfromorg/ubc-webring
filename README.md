# UBC Web Ring ⚡🦅

Inspired by [se-webring.xyz](https://se-webring.xyz).

## What is this?

From [se-webring](https://github.com/simcard0000/se-webring)...

> A web ring is a group of websites linked together in a circular manner, centered around a common theme. They were a big thing in the 90s, as they were used as a sort of search engine optimization technique. The idea behind the SE Web Ring is to have a central place list all websites (personal sites and portfolios) of current and prior SE students and make them more discoverable.

So, this is that, except for UBC computer science students.

(Part of a different UBC department, such as ECE or Math? Consider forking this repository and making your own!)

## Adding your site

To add your site, you **must** be a current student or alumni of the Computer Science department at the University of British Columbia.

Then, do the following.

1. Insert the relevant information into [this file](https://github.com/michaelfromorg/ubc-webring/edit/main/src/data/websites.json)
2. Open a pull request; fill out the template
3. (optional, but highly encouraged) Add the [web ring badge](#badge) to your site

Your (current or former) UBC enrollment will be verified upon submission!

## Contributing

This app is written using React, with TypeScript and Vite. Most of the code was written by Claude.

## Badge

```html
<a href="https://michaelfromorg.github.io/ubc-webring/" target="_blank" rel="noopener noreferrer">
    <img src="/ubc-coa.svg" alt="UBC Webring" width="36" height="50">
</a>
```

Or, for a React app.

```jsx
import ubcCoaUrl from '@/assets/ubc-coa.svg'

export function UBCLogo() {
  return (
    <a 
      href="https://michaelfromorg.github.io/ubc-webring/" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <img 
        src={ubcCoaUrl} 
        alt="UBC Webring" 
        width={36} 
        height={50} 
      />
    </a>
  )
}
```

## Credit

See [simcard0000/se-webring](https://github.com/simcard0000/se-webring) for more rings around the web!

Thanks to the original authors (@simcard0000, @janakitti) for the inspiration, and [this thread](https://x.com/garrethleee/status/1874499577102860691) for the motivation. 
