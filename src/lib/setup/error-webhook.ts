import { WEBHOOK_ERROR } from '#root/config';
import { container } from '@sapphire/framework';
import { WebhookClient } from 'discord.js';

container.webhookError = WEBHOOK_ERROR ? new WebhookClient(WEBHOOK_ERROR) : null;
