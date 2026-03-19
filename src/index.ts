import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Aku IG Hub running on port ${config.port} in ${config.nodeEnv} mode`);
});

export default app;
