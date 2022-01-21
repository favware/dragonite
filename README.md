<div align="center">

<img height="200" src="https://cdn.favware.tech/img/dragonite-avatar.png" alt="Dragonite"/>

# [Dragonite]

**A Pokémon information Discord bot built around Discord Interactions.**

<a href="https://github.com/favware/dragonite/blob/main/LICENSE" alt="License"><img src="https://img.shields.io/github/license/favware/dragonite"/></a>
<a href="https://twitter.com/Favna_/follow" alt="Twitter Follow"><img src="https://img.shields.io/twitter/follow/favna_?label=Follow%20@Favna_&logo=twitter&colorB=1DA1F2&style=flat-square"/></a>

<a href="https://join.favware.tech" alt="Support Server"><img src="https://discord.com/api/guilds/512303595966824458/embed.png?style=banner2"/></a>

</div>

---

# TODO List

- [x] Implement remaining [commands](#commands)
- [x] Refactor embed titles from `pokemonResponseBuilder` and `typeMatchupResponseBuilder` to be inline.
- [x] Make `PaginatedMessage` compatible with interactions so the message hack is not necessary any more.
- [x] Test out BinaryTF for custom id compression (IT WORKS!)
- [ ] Make post-stats task POST data to bot lists.
- [ ] Switch from BinaryTF to @sapphire/string-store (stalled on the package being finished by @kyranet)

## Commands

- [x] `ability`
- [x] `item`
- [x] `move`
- [x] `flavors`
- [x] `pokemon`
- [x] `sprites`
- [x] `learnset`
- [x] `type-matchup`
- [x] `clear-learnset-keys` (OwnerOnly)
- [x] `clear-pokedex-keys` (OwnerOnly)
- [x] `eval` (OwnerOnly)

## Developing on Dragonite

### Requirements

- [`Node.js`]: To run the project.
- [`GraphQL-Pokemon`]: Pokemon API.
- [`Redis`]: Caching of queries and scheduling tasks.

### Optional additions

- [`InfluxDB`]: Metrics platform.

### [Set-Up - Refer to CONTRIBUTING.md]

## A note to aspiring developers who want to self host Dragonite

The developer team does not support the idea of other self-hosted instances of Dragonite. The team prides itself on
providing the best experience and support for the end-users. As such, an offshoot or unaffiliated mirror of Dragonite
may cause ill effects to the reputation and image of Dragonite. If you wish to see new features implemented, please
refer to the developing guidelines linked above.

In addition, Dragonite was built with a dependence on many services which need consistent maintenance and oversight in
order to function and behave properly. These include, but are not limited to,

- [`GraphQL-Pokemon`]: Pokemon API.
- [`Redis`]: Caching of queries and scheduling tasks.
- [`InfluxDB`] in order to keep anonymous metrics on bot usage
- Other external APIs, each requiring their own individual API keys.

With this in mind, it is also worth noting that Dragonite will in no way be capable of running on services such as
[Glitch] or [Heroku]. A dedicated VPS (Virtual Private Server) is required in order to maintain the proper production
environment.

## Story

**A bit of story**: For many years before making Dragonite I've been working on a great variety of Discord bots,
libraries and frameworks. I've started and finished many projects, and I've been lucky enough to see many people being
happy with the results. Among these many projects one of my pride and joys is [`GraphQL-Pokemon`]. This is a highly
detailed Pokémon API, which is used to provide a variety of information about Pokémon, and other Pokémon related data.
It is currently serving several projects, among which [Skyra discord bot][skyra] and [Dexa].

However, as proud as I am for the work that I have been and will be doing for [Skyra][skyra], I have also wanted to
split off its Pokémon module into a separate project to give it more expose to the Discord community. And that's exactly
what this project is. Dragonite will provide top notch Pokémon data for all your Pokémon needs.

## Links

**Dragonite links**

- [Dragonite Invite Link][]
- [Support Server][]
- [Patreon]

**Framework links**

- [Sapphire's Website][]

## Buy us some doughnuts

Favware projects is and always will be open source, even if we don't get donations. That being said, we know there are
amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Ko-fi, Paypal, Patreon, GitHub Sponsorships, and various crypto currencies. You can use the
buttons below to donate through your method of choice.

|   Donate With   |                      Address                      |
| :-------------: | :-----------------------------------------------: |
|      Ko-fi      |  [Click Here](https://donate.favware.tech/kofi)   |
|     Patreon     | [Click Here](https://donate.favware.tech/patreon) |
|     PayPal      | [Click Here](https://donate.favware.tech/paypal)  |
| GitHub Sponsors |  [Click Here](https://github.com/sponsors/Favna)  |
|     Bitcoin     |       `1E643TNif2MTh75rugepmXuq35Tck4TnE5`        |
|    Ethereum     |   `0xF653F666903cd8739030D2721bF01095896F5D6E`    |
|    LiteCoin     |       `LZHvBkaJqKJRa8N7Dyu41Jd1PDBAofCik6`        |

[`graphql-pokemon`]: https://github.com/favware/graphql-pokemon
[`influxdb`]: https://v2.docs.influxdata.com/v2.0/get-started/
[`node.js`]: https://nodejs.org/en/download/current/
[`redis`]: https://redis.io
[dexa]: https://github.com/favware/dexa
[glitch]: https://glitch.com/
[heroku]: https://www.heroku.com/
[patreon]: https://donate.favware.tech/patreon
[sapphire framework]: https://github.com/sapphiredev/framework
[sapphire's website]: https://sapphirejs.dev
[sapphiredev]: https://github.com/sapphiredev
[set-up - refer to contributing.md]: /.github/CONTRIBUTING.md
[skyra]: https://skyra.pw
[dragonite invite link]: https://dragonite.favware.tech
[support server]: https://join.favware.tech
[dragonite]: https://bulbapedia.bulbagarden.net/wiki/Dragonite_(Pokémon)
