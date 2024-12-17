import { BaseLoginProvider } from '@abacritt/angularx-social-login/';
@Injectable({ providedIn: 'root' })
export class LinkedInLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'CUSTOM' as const;

  constructor(/* infinite list of dependencies*/) {}
}