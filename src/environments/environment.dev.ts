// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mainserviceUrl: 'http://localhost:8080/',
  uiUrl: 'http://localhost:4200/',
  isTesting: true,
  piecoins:{
      monthly_quiz : 200,
      domain_expertize_sharing : 500,
      top_performer : 200,
      consistent_cm : 300,
      impact_player : 200,
      club_leader : 500,
      creative_content : 200,
      cm_referral_joining : 100,
      cm_referral_2cv_s2c : 100,
      cm_referral_1st_northstar : 100,
      ninety_days_active : 200,
      prospect_reached_validated : 500,
      pilot_batch_48hrs : 50, //max 3 candidates
      crossed_exploratory_call : 50,
      disc_intrv_round : 50,//till max 3 rounds
      disc_offer_sent : 100,
      disc_offer_accepted : 200,
      disc_joined : 200,
      client_nps: 1000,
      talent_nps : 500,
      cobuddies_northstar : 100,
      cobuddy_success : 50,
      all_cobuddy_attend_event : 100
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
