const _ = require('lodash');
const Bot = require('./lib/bot.js');

const token = process.env.SLACK_TOKEN;
const webhookUrl = process.env.SLACK_WEBHOOK_URL;

// create bot instance
const bot = new Bot({
  token,
  webhookUrl,
  autoReconnect: true,
  autoMark: true
});


bot.respondTo('ATH-[A-Z0-9]{8}', (message, channel, user) => {
  const fulltext = message.text;
  const userRealName = user.real_name;
  const matchedOrderIds = fulltext.match(/ATH-[A-Z0-9]{8}/ig);
  const actions = _.flatMap(matchedOrderIds, orderId => {
    return [{
      'type': 'button',
      'text': `Production ${orderId}`,
      'url': `https://pinjam.indodana.com/ops/applications/${orderId}/detail`
    }, {
      'type': 'button',
      'text': `Staging ${orderId}`,
      'url': `https://stg1.indodana.com/ops/applications/${orderId}/detail`
    }];
  });

  bot.sendFormatted(`Hello, ${userRealName} just send you an application order id.`, channel, {
    attachments: [
      {
        fallback: 'Nothing',
        actions
      }
    ]
  });
});

