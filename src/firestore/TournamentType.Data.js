const AppData = {
  collection: "tournament_type",
  batches: [
    {
      number: "1",
      rows: [
        {
          id: "WC",
          data: {
            name: "FIFA World Cup",
            team_type_id: "MNT",
            confederation_id: "FIFA",
            sport_id: "SOC"
          }
        },
        {
          id: "CONFEDC",
          data: {
            name: "FIFA Confederations Cup",
            team_type_id: "MNT",
            confederation_id: "FIFA",
            sport_id: "SOC"
          }
        },
        {
          id: "EURO",
          data: {
            name: "UEFA European Championship",
            team_type_id: "MNT",
            confederation_id: "UEFA",
            sport_id: "SOC"
          }
        },
        {
          id: "UNL",
          data: {
            name: "UEFA Nations League",
            team_type_id: "MNT",
            confederation_id: "UEFA",
            sport_id: "SOC"
          }
        },
        {
          id: "ONC",
          data: {
            name: "OFC Nations Cup",
            team_type_id: "MNT",
            confederation_id: "OFC",
            sport_id: "SOC"
          }
        },
        {
          id: "AAC",
          data: {
            name: "AFC Asian Cup",
            team_type_id: "MNT",
            confederation_id: "AFC",
            sport_id: "SOC"
          }
        },
        {
          id: "CAN",
          data: {
            name: "CAF Africa Cup of Nations",
            team_type_id: "MNT",
            confederation_id: "CAF",
            sport_id: "SOC"
          }
        },
        {
          id: "GC",
          data: {
            name: "CONCACAF Gold Cup",
            team_type_id: "MNT",
            confederation_id: "CONCACAF",
            sport_id: "SOC"
          }
        },
        {
          id: "COPA",
          data: {
            name: "CONMEBOL Copa America",
            team_type_id: "MNT",
            confederation_id: "CONMEBOL",
            sport_id: "SOC"
          }
        },
        {
          id: "UCL",
          data: {
            name: "UEFA Champions League",
            team_type_id: "CLUB",
            confederation_id: "UEFA",
            sport_id: "SOC"
          }
        },
        {
          id: "UEL",
          data: {
            name: "UEFA Europa League",
            team_type_id: "CLUB",
            confederation_id: "UEFA",
            sport_id: "SOC"
          }
        },
        {
          id: "WWC",
          data: {
            name: "FIFA Women's World Cup",
            team_type_id: "WNT",
            confederation_id: "FIFA",
            sport_id: "SOC"
          }
        },
        {
          id: "OFT",
          data: {
            name: "Olympic Football Tournament",
            team_type_id: "U23MNT",
            confederation_id: "FIFA",
            sport_id: "SOC"
          }
        },
        {
          id: "WOFT",
          data: {
            name: "Women's Olympic Football Tournament",
            team_type_id: "U23WNT",
            confederation_id: "FIFA",
            sport_id: "SOC"
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
              sport_id: "FBL"
            }
          },
          {
            id: "ATP",
            data: {
              name: "ATP Men's Singles",
              team_type_id: "TENMS",
              confederation_id: "",
              sport_id: "TEN"
            }
          },
          {
            id: "WTA",
            data: {
              name: "WTA Women's Singles",
              team_type_id: "TENWS",
              confederation_id: "",
              sport_id: "TEN"
            }
          }
        ]
      }
  ]
};

export default AppData;
