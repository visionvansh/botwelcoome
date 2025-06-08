require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

// Environment variable for bot token (set this in your .env file or hosting platform)

     const TOKEN = process.env.DISCORD_BOT_TOKEN;
     const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID; // Replace with your welcome channel ID

// Array of embed colors for variety (white, yellow, black-ish dark theme)
const embedColors = [
  0xFFFFFF, // White
  0xFFFF00, // Yellow
  0x2F3136, // Dark (black-ish, Discord's dark theme color)
];

// Bot ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handle new member joining
client.on('guildMemberAdd', async (member) => {
  try {
    // Get the welcome channel
    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!welcomeChannel || !welcomeChannel.isTextBased()) {
      console.error('Welcome channel not found or is not a text channel.');
      return;
    }

    // Randomly select a color for the embed
    const randomColor = embedColors[Math.floor(Math.random() * embedColors.length)];

    // Create the embedded welcome message
    const welcomeEmbed = new EmbedBuilder()
      .setTitle('🎉 Welcome to Clipify Post! 🎉')
      .setDescription(
        `**Welcome ${member.user.toString()} to Clipify Post!** 🚀\n` +
        'Get ready to break matrix and earn $$! 🌌\n' +
        'Here, you can **earn big** by:\n' +
        '- 🎥 **Editing & uploading awesome reels**.\n' +
        '- 🤝 **Referring friends** to break this matrix!\n\n' +
        'Join clipify, create, share, and *earn*! Let’s make this server **legendary**! 💥'
      )
      .setColor(randomColor)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'Clipify Post | Let’s Create & Earn!' })
      .setTimestamp();

    // Send the welcome message to the welcome channel
    await welcomeChannel.send({
      content: `${member.user.toString()} just joined! Let’s give them a warm welcome! 🙌`,
      embeds: [welcomeEmbed],
    });

    // Send the same embedded message to the user via DM
    try {
      await member.send({
        content: `Hey ${member.user.username}! Welcome to **Clipify Post**! 🎉!`,
        embeds: [welcomeEmbed],
      });
      console.log(`Sent DM to ${member.user.tag}`);
    } catch (dmError) {
      console.error(`Failed to send DM to ${member.user.tag}:`, dmError);
    }
  } catch (error) {
    console.error('Error handling guildMemberAdd event:', error);
  }
});

// Log in to Discor
client.login(TOKEN);