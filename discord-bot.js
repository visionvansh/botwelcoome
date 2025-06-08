require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;

const embedColors = [0xFFFFFF, 0xFFFF00, 0x2F3136];

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!welcomeChannel || !welcomeChannel.isTextBased()) {
      console.error('Welcome channel not found or is not a text channel.');
      return;
    }

    const randomColor = embedColors[Math.floor(Math.random() * embedColors.length)];

    const welcomeEmbed = new EmbedBuilder()
      .setTitle('🎉 Welcome to Clipify Post! 🎉')
      .setDescription(
        `**Welcome ${member.user.toString()} to Clipify Post!** 🚀\n` +
        'Get ready to break the matrix and earn $$! 🌌\n' +
        'Here, you can **earn big** by:\n' +
        '- 🎥 **Editing & uploading awesome reels**.\n' +
        '- 🤝 **Referring friends** to break this matrix!\n\n' +
        'Join Clipify, create, share, and *earn*! Let’s make this server **legendary**! 💥'
      )
      .setColor(randomColor)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'Clipify Post | Let’s Create & Earn!' })
      .setTimestamp();

    await welcomeChannel.send({
      content: `${member.user.toString()} just joined! Let’s give them a warm welcome! 🙌`,
      embeds: [welcomeEmbed],
    });

    try {
      await member.send({
        content: `Hey ${member.user.username}! Welcome to **Clipify Post**! 🎉`,
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

client.login(TOKEN);