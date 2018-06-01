# Aston Events Site

This is my coursework submission for my second year CS Internet Applications and Techniques module. We were tasked to create a website that could allow users to view student events. Students can register as an organiser to create and edit event pages that would be listed on the main page, as well as expand to an event page.

I learnt to use `NodeJS` with `Express`, with `MongoDB` (using `mongoose`) to handle the data store (because I'm a wanna-be hipster). And in seemingly modern web dev fashion, I learnt about the use of a bunch of npm packages to do the fancy stuff I wanted.

Licensed with MIT :metal:

[![Built with Spacemacs](https://cdn.rawgit.com/syl20bnr/spacemacs/442d025779da2f62fc86c2082703697714db6514/assets/spacemacs-badge.svg)](http://spacemacs.org)

---

## Footnotes of Shame

Why did I use Pug and not a proper dynamic front end thingymaic? Because I'm an idiot.

Are the organiser actions secure? No, as I was going to provide a secure session token but had time constraints—turns out web dev is hard. And yes, I failed to provide server-side vetting of POST requests in time too :(
