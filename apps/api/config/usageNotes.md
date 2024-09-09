## From tutorial https://www.tomray.dev/nestjs-config

"You'll need to inject the ConfigService using constructor injection (same as all other services you import), and then you'll have access to the configService.get method as shown below:"

Checking if needed env-vars are defined:
"Another technique is to throw an error in the constructor of the class if the configuration values you need are not what you expect:"

```TS
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
  private port: number;
  private pokemonAPIKey: string;

  constructor(private readonly configService: ConfigService) {
    const port = this.configService.get<number>('port');
    const pokemonAPIKey = this.configService.get<string>('pokemonService.apiKey');

    if (!port || !pokemonAPIKey) {
      throw new Error(`Environment variables are missing`);
    }

    this.port = port;
    this.pokemonAPIKey = pokemonAPIKey;
  }

  someFunction(param: string) {
    const port = this.configService.get<number>('port');
      // ...
  }

  someOtherFunction(param: string) {
    const pokemonAPIKey = this.configService.get<string>('pokemonService.apiKey');
      // ...
  }
}
```
