import { PokemonEnum } from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';

const megaRegex = /^(?<name>[a-z]+)(?:mega)$/;
const gmaxRegex = /^(?<name>[a-z]+)(?:gmax)$/;
const alolanTotemRegex = /^(?<name>[a-z]+)(?:alolatotem)$/;
const alolanRegex = /^(?<name>[a-z]+)(?:alola)$/;
const galarianRegex = /^(?<name>[a-z]+)(?:galar)$/;
const totemRegex = /^(?<name>[a-z]+)(?:totem)$/;
const typeLikeRegex = /^(?<name>(?:arceus|silvally|genesect))(?<type>[a-z]+)?$/;
const pumpkinRegex = /^(?<name>(?:pumpkaboo|gourgeist))(?<size>(?:small|large|super))$/g;

export function pokemonEnumToSpecies(pokemon: PokemonEnum): string {
  switch (pokemon) {
    // Some exclusions that cannot be handled easily by the regex
    case PokemonEnum.Yanmega:
      return 'Yanmega';

    case PokemonEnum.Charizardmegax:
      return 'Mega Charizard X';
    case PokemonEnum.Charizardmegay:
      return 'Mega Charizard Y';

    case PokemonEnum.Mewtwomegax:
      return 'Mega Mewtwo X';
    case PokemonEnum.Mewtwomegay:
      return 'Mega Mewtwo Y';

    case PokemonEnum.Venomiconepilogue:
      return 'Venomicon Epilogue';

    case PokemonEnum.Mimejr:
      return 'Mime Jr.';
    case PokemonEnum.Mrmime:
      return 'Mr. Mime';
    case PokemonEnum.Mrmimegalar:
      return 'Galarian Mr. Mime';
    case PokemonEnum.Mrrime:
      return 'Mr. Rime';

    case PokemonEnum.Hooh:
      return 'Ho-Oh';

    case PokemonEnum.Castformrainy:
      return 'Castform Rainy';
    case PokemonEnum.Castformsunny:
      return 'Castform Sunny';
    case PokemonEnum.Castformsnowy:
      return 'Castform Snowy';

    case PokemonEnum.Kyogreprimal:
      return 'Primal Kyogre';
    case PokemonEnum.Groudonprimal:
      return 'Primal Groudon';

    case PokemonEnum.Deoxysattack:
      return 'Deoxys Attack';
    case PokemonEnum.Deoxysdefense:
      return 'Deoxys Defense';
    case PokemonEnum.Deoxysspeed:
      return 'Deoxys Speed';

    case PokemonEnum.Wormadamsandy:
      return 'Wormadam Sandy';
    case PokemonEnum.Wormadamtrash:
      return 'Wormadam Trash';

    case PokemonEnum.Cherrimsunshine:
      return 'Cherrim Sunshine';

    case PokemonEnum.Porygonz:
      return 'Porygon-Z';

    case PokemonEnum.Rotomheat:
      return 'Rotom Heat';
    case PokemonEnum.Rotomwash:
      return 'Rotom Wash';
    case PokemonEnum.Rotomfrost:
      return 'Rotom Frost';
    case PokemonEnum.Rotomfan:
      return 'Rotom Fan';
    case PokemonEnum.Rotommow:
      return 'Rotom Mow';

    case PokemonEnum.Giratinaorigin:
      return 'Giratina Origin';

    case PokemonEnum.Shayminsky:
      return 'Shaymin Sky';

    case PokemonEnum.Basculinbluestriped:
      return 'Basculin Blue-Striped';

    case PokemonEnum.Darmanitanzen:
      return 'Darmanitan Zen';
    case PokemonEnum.Darmanitangalarzen:
      return 'Galarian Darmanitan Zen';

    case PokemonEnum.Frillishfemale:
      return 'Frillish (Female)';
    case PokemonEnum.Jellicentfemale:
      return 'Jellicent (Female)';

    case PokemonEnum.Tornadustherian:
      return 'Tornadus Therian';
    case PokemonEnum.Thundurustherian:
      return 'Thundurus Therian';
    case PokemonEnum.Landorustherian:
      return 'Landorus Therian';

    case PokemonEnum.Kyuremblack:
      return 'Black Kyurem';
    case PokemonEnum.Kyuremwhite:
      return 'White Kyurem';

    case PokemonEnum.Keldeoresolute:
      return 'Keldeo Resolute Form';

    case PokemonEnum.Meloettapirouette:
      return 'Meloetta Pirouette Forme';

    case PokemonEnum.Greninjaash:
      return 'Ash Greninja';

    case PokemonEnum.Vivillonfancy:
      return 'Fancy Vivillon';
    case PokemonEnum.Vivillonpokeball:
      return 'Pokeball Vivillon';

    case PokemonEnum.Floetteeternal:
      return 'Eternal Flower Floette';

    case PokemonEnum.Meowsticf:
      return 'Meowstic (Female)';

    case PokemonEnum.Aegislashblade:
      return 'Aegislash Blade Forme';

    case PokemonEnum.Xerneasneutral:
      return 'Xerneas Neutral';

    case PokemonEnum.Zygarde10:
      return 'Zygarde 10%';
    case PokemonEnum.Zygardecomplete:
      return 'Zygarde Complete';

    case PokemonEnum.Hoopaunbound:
      return 'Hoopa Unbound';

    case PokemonEnum.Oricoriopompom:
      return 'Oricorio Pompom';
    case PokemonEnum.Oricoriosensu:
      return 'Oricorio Sensu';
    case PokemonEnum.Oricoriopau:
      return "Oricorio Pa'u";

    case PokemonEnum.Lycanrocmidnight:
      return 'Midnight Lycanroc';
    case PokemonEnum.Lycanrocdusk:
      return 'Dusk Lycanroc';

    case PokemonEnum.Wishiwashischool:
      return 'Wishiwashi School';

    case PokemonEnum.Typenull:
      return 'Type: Null';

    case PokemonEnum.Miniormeteor:
      return 'Minior Meteor';

    case PokemonEnum.Mimikyubusted:
      return 'Mimikyu Busted';
    case PokemonEnum.Mimikyubustedtotem:
      return 'Totem Mimikyu Busted';

    case PokemonEnum.Jangmoo:
      return 'Jangmo-o';
    case PokemonEnum.Hakamoo:
      return 'Hakamo-o';
    case PokemonEnum.Kommoo:
      return 'Kommo-o';
    case PokemonEnum.Kommoototem:
      return 'Totem Kommo-o';

    case PokemonEnum.Tapukoko:
      return 'Tapu Koko';
    case PokemonEnum.Tapulele:
      return 'Tapu Lele';
    case PokemonEnum.Tapubulu:
      return 'Tapu Bulu';
    case PokemonEnum.Tapufini:
      return 'Tapu Fini';

    case PokemonEnum.Necrozmaduskmane:
      return 'Duskmane Necrozma';
    case PokemonEnum.Necrozmadawnwings:
      return 'Dawnwings Necrozma';
    case PokemonEnum.Necrozmaultra:
      return 'Ultra Necrozma';

    case PokemonEnum.Magearnaoriginal:
      return 'Magearna Original';

    case PokemonEnum.Cramorantgulping:
      return 'Gulping Cramorant';
    case PokemonEnum.Cramorantgorging:
      return 'Gorging Cramorant';

    case PokemonEnum.Toxtricitylowkey:
      return 'Low Key Toxtricity';
    case PokemonEnum.Toxtricitylowkeygmax:
      return 'G-Max Low Key Toxtricity';

    case PokemonEnum.Sinisteaantique:
      return 'Antique Sinistea';
    case PokemonEnum.Polteageistantique:
      return 'Antique Polteageist';

    case PokemonEnum.Eiscuenoice:
      return 'Eiscue Noice';

    case PokemonEnum.Indeedeef:
      return 'Indeedee (Female)';

    case PokemonEnum.Morpekohangry:
      return 'Hangry Morpeko';

    case PokemonEnum.Zaciancrowned:
      return 'Zacian Crowned';
    case PokemonEnum.Zamazentacrowned:
      return 'Zamazenta Crowned';
    case PokemonEnum.Eternatuseternamax:
      return 'Eternatus Eternamax';

    case PokemonEnum.Urshifurapidstrike:
      return 'Rapid-Strike Urshifu';
    case PokemonEnum.Urshifurapidstrikegmax:
      return 'G-Max Rapid-Strike Urshifu';

    case PokemonEnum.Zarudedada:
      return 'Zarude Dada';

    case PokemonEnum.Calyrexice:
      return 'Calyrex Ice';
    case PokemonEnum.Calyrexshadow:
      return 'Calyrex Shadow';

    // All the PokeStar Pokémon
    case PokemonEnum.Pokestarsmeargle:
      return 'PokéStar Smeargle';
    case PokemonEnum.Pokestarufo:
      return 'PokéStar UFO';
    case PokemonEnum.Pokestarufo2:
      return 'PokéStar UFO-2';
    case PokemonEnum.Pokestarbrycenman:
      return 'PokéStar Brycen-Man';
    case PokemonEnum.Pokestarmt:
      return 'PokéStar MT';
    case PokemonEnum.Pokestarmt2:
      return 'PokéStar MT2';
    case PokemonEnum.Pokestartransport:
      return 'PokéStar Transport';
    case PokemonEnum.Pokestargiant:
      return 'PokéStar Giant';
    case PokemonEnum.Pokestarhumanoid:
      return 'PokéStar Humanoid';
    case PokemonEnum.Pokestarmonster:
      return 'PokéStar Monster';
    case PokemonEnum.Pokestarf00:
      return 'PokéStar F-00';
    case PokemonEnum.Pokestarf002:
      return 'PokéStar F-002';
    case PokemonEnum.Pokestarspirit:
      return 'PokéStar Spirit';
    case PokemonEnum.Pokestarblackdoor:
      return 'PokéStar Black Door';
    case PokemonEnum.Pokestarwhitedoor:
      return 'PokéStar White Door';
    case PokemonEnum.Pokestarblackbelt:
      return 'PokéStar Black Belt';
    case PokemonEnum.Pokestarufopropu2:
      return 'PokéStar UFO-PropU2';

    // All the Pikachu's
    case PokemonEnum.Pikachucosplay:
      return 'Pikachu Cosplay';
    case PokemonEnum.Pikachurockstar:
      return 'Pikachu Rock Star';
    case PokemonEnum.Pikachubelle:
      return 'Pikachu Belle';
    case PokemonEnum.Pikachupopstar:
      return 'Pikachu Pop Star';
    case PokemonEnum.Pikachuphd:
      return 'Pikachu PhD';
    case PokemonEnum.Pikachulibre:
      return 'Pikachu Libre';
    case PokemonEnum.Pikachuoriginal:
      return 'Pikachu Kanto Cap';
    case PokemonEnum.Pikachuhoenn:
      return 'Pikachu Honey Cap';
    case PokemonEnum.Pikachusinnoh:
      return 'Pikachu Sinnoh Cap';
    case PokemonEnum.Pikachuunova:
      return 'Pikachu Novae Cap';
    case PokemonEnum.Pikachukalos:
      return 'Pikachu Kalos Cap';
    case PokemonEnum.Pikachualola:
      return 'Pikachu Alola Cap';
    case PokemonEnum.Pikachupartner:
      return 'Pikachu (I Choose You)';
    case PokemonEnum.Pikachustarter:
      return "Pikachu (Let's Go)";
    case PokemonEnum.Pikachuworld:
      return 'Pikachu (Journeys)';
    case PokemonEnum.Pichuspikyeared:
      return 'Spiky Eared Pichu';
    case PokemonEnum.Eeveestarter:
      return "Eevee (Let's Go)";
    default: {
      const megaResult = megaRegex.exec(pokemon);

      if (megaResult && megaResult.groups?.name) {
        return `Mega ${toTitleCase(megaResult.groups.name)}`;
      }

      const gmaxResult = gmaxRegex.exec(pokemon);

      if (gmaxResult && gmaxResult.groups?.name) {
        return `G-Max ${toTitleCase(gmaxResult.groups.name)}`;
      }

      const alolanTotemResult = alolanTotemRegex.exec(pokemon);

      if (alolanTotemResult && alolanTotemResult.groups?.name) {
        return `Alolan Totem ${toTitleCase(alolanTotemResult.groups.name)}`;
      }

      const totemResult = totemRegex.exec(pokemon);

      if (totemResult && totemResult.groups?.name) {
        return `Totem ${toTitleCase(totemResult.groups.name)}`;
      }

      const alolanResult = alolanRegex.exec(pokemon);

      if (alolanResult && alolanResult.groups?.name) {
        return `Alolan ${toTitleCase(alolanResult.groups.name)}`;
      }

      const galarianResult = galarianRegex.exec(pokemon);

      if (galarianResult && galarianResult.groups?.name) {
        return `Galarian ${toTitleCase(galarianResult.groups.name)}`;
      }

      const typeLikeResult = typeLikeRegex.exec(pokemon);

      if (typeLikeResult && typeLikeResult.groups?.name && typeLikeResult.groups?.type) {
        return `${toTitleCase(typeLikeResult.groups.name)} ${toTitleCase(typeLikeResult.groups.type)}`;
      }

      const pumpkinResult = pumpkinRegex.exec(pokemon);

      if (pumpkinResult && pumpkinResult.groups?.name && pumpkinResult.groups?.size) {
        return `${toTitleCase(pumpkinResult.groups.name)} ${toTitleCase(pumpkinResult.groups.size)}`;
      }

      return toTitleCase(pokemon);
    }
  }
}

/**
 * Parses a Bulbapedia-like URL to be properly embeddable on Discord
 * @param url URL to parse
 */
export function parseBulbapediaURL(url: string) {
  return url.replace(/[ ]/g, '_').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

/**
 * Parses PokéDex colours to Discord MessageEmbed colours
 * @param colour The colour to parse
 */
export function resolveColour(colour: string) {
  switch (colour) {
    case 'Black':
      return 0x323232;
    case 'Blue':
      return 0x257cff;
    case 'Brown':
      return 0xa3501a;
    case 'Gray':
      return 0x969696;
    case 'Green':
      return 0x3eff4e;
    case 'Pink':
      return 0xff65a5;
    case 'Purple':
      return 0xa63de8;
    case 'Red':
      return 0xff3232;
    case 'White':
      return 0xe1e1e1;
    case 'Yellow':
      return 0xfff359;
    default:
      return 0xff0000;
  }
}
