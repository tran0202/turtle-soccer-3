export const AppData = {
  collection: "tournament_type",
  batches: [
    {
      number: "1",
      rows: [
        {
          id: "WC",
          data: {
            name: "FIFA World Cup",
            confederation_id: "FIFA",
            team_type_id: "MNT",
            logo_path: "wc_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "CONFEDC",
          data: {
            name: "FIFA Confederations Cup",
            confederation_id: "FIFA",
            team_type_id: "MNT",
            logo_path: "cc_logos",
            sport_id: "SOC",
            order: 5
          }
        },
        {
          id: "EURO",
          data: {
            name: "UEFA European Championship",
            team_type_id: "MNT",
            confederation_id: "UEFA",
            logo_path: "euro_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "UNL",
          data: {
            name: "UEFA Nations League",
            team_type_id: "MNT",
            confederation_id: "UEFA",
            logo_path: "unl_logos",
            sport_id: "SOC",
            order: 4
          }
        },
        {
          id: "ONC",
          data: {
            name: "OFC Nations Cup",
            team_type_id: "MNT",
            confederation_id: "OFC",
            logo_path: "logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "AAC",
          data: {
            name: "AFC Asian Cup",
            team_type_id: "MNT",
            confederation_id: "AFC",
            logo_path: "aac_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "AFCON",
          data: {
            name: "CAF Africa Cup of Nations",
            team_type_id: "MNT",
            confederation_id: "CAF",
            logo_path: "afcon_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "GC",
          data: {
            name: "CONCACAF Gold Cup",
            team_type_id: "MNT",
            confederation_id: "CONCACAF",
            logo_path: "gc_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "COPA",
          data: {
            name: "CONMEBOL Copa America",
            team_type_id: "MNT",
            confederation_id: "CONMEBOL",
            logo_path: "copa_logos",
            sport_id: "SOC",
            order: 1
          }
        },
        {
          id: "UCL",
          data: {
            name: "UEFA Champions League",
            team_type_id: "CLUB",
            confederation_id: "UEFA",
            logo_path: "club_logos",
            sport_id: "SOC",
            order: 2
          }
        },
        {
          id: "UEL",
          data: {
            name: "UEFA Europa League",
            team_type_id: "CLUB",
            confederation_id: "UEFA",
            logo_path: "club_logos",
            sport_id: "SOC",
            order: 3
          }
        },
        {
          id: "WWC",
          data: {
            name: "FIFA Women's World Cup",
            team_type_id: "WNT",
            confederation_id: "FIFA",
            logo_path: "wwc_logos",
            sport_id: "SOC",
            order: 2
          }
        },
        {
          id: "OFT",
          data: {
            name: "Olympic Football Tournament",
            team_type_id: "U23MNT",
            confederation_id: "FIFA",
            logo_path: "olympic_logos",
            sport_id: "SOC",
            order: 3
          }
        },
        {
          id: "WOFT",
          data: {
            name: "Women's Olympic Football Tournament",
            team_type_id: "U23WNT",
            confederation_id: "FIFA",
            logo_path: "olympic_logos",
            sport_id: "SOC",
            order: 4
          }
        }
      ]
    },
    {
        number: "2",
        rows: [
          {
            id: "NFL",
            data: {
              name: "NFL Football Season",
              team_type_id: "FBLT",
              confederation_id: "",
              logo_path: "nfl_logos",
              sport_id: "FBL"
            }
          },
          {
            id: "ATP",
            data: {
              name: "ATP Men's Singles",
              team_type_id: "TENMS",
              confederation_id: "",
              logo_path: "logos",
              sport_id: "TEN"
            }
          },
          {
            id: "WTA",
            data: {
              name: "WTA Women's Singles",
              team_type_id: "TENWS",
              confederation_id: "",
              logo_path: "logos",
              sport_id: "TEN"
            }
          }
        ]
      }
  ]
};
