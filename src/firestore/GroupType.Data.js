const AppData = {
  collection: "group_type",
  batches: [
    {
      number: "1",
      rows: [
        {
          id: "LGE",
          data: {
            name: "League",
            description: "league of groups"
          }
        },
        {
          id: "GRP",
          data: {
            name: "Group",
            description: "group of teams in a tournament"
          }
        },
        {
          id: "STGE",
          data: {
            name: "Stage",
            description: "stage in a tournament"
          }
        },
        {
          id: "RND",
          data: {
            name: "Round",
            description: "round of matches in a tournament"
          }
        },
        {
          id: "CFED",
          data: {
            name: "Confederation",
            description: "confederation of teams"
          }
        },
        {
          id: "TEAM",
          data: {
            name: "Team",
            description: "team"
          }
        }
      ]
    },
    {
        number: "2",
        rows: [
          {
            id: "CFER",
            data: {
              name: "Conference",
              description: "conference of divisions"
            }
          },
          {
            id: "DIV",
            data: {
              name: "Division",
              description: "division"
            }
          },
          {
            id: "NAT",
            data: {
              name: "Nation",
              description: "nation or territory"
            }
          }
        ]
      }
  ]
};

export default AppData;
