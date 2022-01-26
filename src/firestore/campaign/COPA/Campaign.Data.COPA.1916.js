export const AppData = {
  collection: 'campaign',
  batches: [
    {
      number: '101',
      rows: [
        {
          id: 'UNL202021',
          data: {
            name: 'Tournament',
            tournament_id: 'UNL202021',
            multiple_leagues: true,
            description: 'UEFA Nations League 2020-21',
            order: 9,
            leagues: [
              {
                name: 'League A',
                default: true,
                default_matchday: 'Matchday 1',
                standing_count: 0,
                stages: [
                  {
                    name: 'Group Stage',
                    type: 'roundrobin',
                    home_and_away: true,
                    multiple_matchdays: true,
                    advancement: {
                      auto: [1],
                      eliminated: [2, 3],
                      relegated: [4],
                      text: 'The top teams in League A would advance to the Nations League Finals. The top teams in leagues B, C and D would be promoted to the higher league. The last-placed teams in leagues A and B would be relegated to the lower league. The last-placed teams in league C would play in relegation play-outs to determine 2 to be relegated to league D.',
                    },
                    groups: [
                      {
                        name: 'Group 1',
                        teams: [{ id: 'ITA' }, { id: 'BIH' }, { id: 'NED' }, { id: 'POL' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [
                              {
                                home_team: { id: 'ITA' },
                                away_team: { id: 'BIH' },
                                home_score: 1,
                                away_score: 1,
                                date: '2020-09-04',
                                time: '20:45',
                                stadium: 'Stadio Artemio Franchi',
                                city: 'Florence',
                              },
                              {
                                home_team: { id: 'NED' },
                                away_team: { id: 'POL' },
                                home_score: 1,
                                away_score: 0,
                                date: '2020-09-04',
                                time: '20:45',
                                stadium: 'Johan Cruyff Arena',
                                city: 'Amsterdam',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 2',
                            matches: [
                              {
                                home_team: { id: 'BIH' },
                                away_team: { id: 'POL' },
                                home_score: 1,
                                away_score: 2,
                                date: '2020-09-07',
                                time: '20:45',
                                stadium: 'Bilino Polje',
                                city: 'Zenica',
                              },
                              {
                                home_team: { id: 'NED' },
                                away_team: { id: 'ITA' },
                                home_score: 0,
                                away_score: 1,
                                date: '2020-09-07',
                                time: '20:45',
                                stadium: 'Johan Cruyff Arena',
                                city: 'Amsterdam',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 3',
                            matches: [
                              {
                                home_team: { id: 'BIH' },
                                away_team: { id: 'NED' },
                                home_score: 0,
                                away_score: 0,
                                date: '2020-10-11',
                                time: '18:00',
                                stadium: 'Bilino Polje',
                                city: 'Zenica',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'Group 2',
                        teams: [{ id: 'ISL' }, { id: 'ENG' }, { id: 'DEN' }, { id: 'BEL' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [
                              {
                                home_team: { id: 'ISL' },
                                away_team: { id: 'ENG' },
                                home_score: 0,
                                away_score: 1,
                                date: '2020-09-05',
                                time: '18:00',
                                stadium: 'Laugardalsvöllur',
                                city: 'Reykjavík',
                              },
                              {
                                home_team: { id: 'DEN' },
                                away_team: { id: 'BEL' },
                                home_score: 0,
                                away_score: 2,
                                date: '2020-09-05',
                                time: '20:45',
                                stadium: 'Parken Stadium',
                                city: 'Copenhagen',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 2',
                            matches: [
                              {
                                home_team: { id: 'BEL' },
                                away_team: { id: 'ISL' },
                                home_score: 5,
                                away_score: 1,
                                date: '2020-09-08',
                                time: '20:45',
                                stadium: 'King Baudouin Stadium',
                                city: 'Brussels',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 3',
                            matches: [
                              {
                                home_team: { id: 'ENG' },
                                away_team: { id: 'BEL' },
                                home_score: 2,
                                away_score: 1,
                                date: '2020-10-11',
                                time: '18:00',
                                stadium: 'Wembley Stadium',
                                city: 'London',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'Group 3',
                        teams: [{ id: 'POR' }, { id: 'CRO' }, { id: 'SWE' }, { id: 'FRA' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [
                              {
                                home_team: { id: 'SWE' },
                                away_team: { id: 'FRA' },
                                home_score: 0,
                                away_score: 1,
                                date: '2020-09-05',
                                time: '20:45',
                                stadium: 'Friends Arena',
                                city: 'Solna',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'Group 4',
                        teams: [{ id: 'GER' }, { id: 'ESP' }, { id: 'UKR' }, { id: 'SUI' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [
                              {
                                home_team: { id: 'GER' },
                                away_team: { id: 'ESP' },
                                home_score: 1,
                                away_score: 1,
                                date: '2020-09-03',
                                time: '20:45',
                                stadium: 'Mercedes-Benz Arena',
                                city: 'Stuttgart',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 2',
                            matches: [
                              {
                                home_team: { id: 'ESP' },
                                away_team: { id: 'UKR' },
                                home_score: 4,
                                away_score: 0,
                                date: '2020-09-06',
                                time: '20:45',
                                stadium: 'Alfredo Di Stéfano',
                                city: 'Madrid',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'Finals',
                    type: 'knockout',
                    rounds: [
                      {
                        name: 'Semi-finals',
                        short_name: '1/2',
                        eliminate_count: 2,
                        next_round: 'Final',
                        matches: [
                          {
                            home_team: { id: 'ITA' },
                            away_team: { id: 'ESP' },
                            home_score: 1,
                            away_score: 2,
                            date: '2021-10-06',
                            time: '20:45',
                            stadium: 'San Siro',
                            city: 'Milan',
                            bracket_order: 1,
                          },
                          {
                            home_team: { id: 'BEL' },
                            away_team: { id: 'FRA' },
                            home_score: 2,
                            away_score: 3,
                            date: '2021-10-07',
                            time: '20:45',
                            stadium: 'Juventus Stadium',
                            city: 'Turin',
                            bracket_order: 2,
                          },
                        ],
                      },
                      {
                        name: 'Third-place',
                        short_name: '3rd',
                        matches: [
                          {
                            home_team: { id: 'ITA' },
                            away_team: { id: 'BEL' },
                            home_score: 2,
                            away_score: 1,
                            date: '2021-10-10',
                            time: '15:00',
                            stadium: 'Juventus Stadium',
                            city: 'Turin',
                          },
                        ],
                      },
                      {
                        name: 'Final',
                        short_name: '1st',
                        matches: [
                          {
                            home_team: { id: 'ESP' },
                            away_team: { id: 'FRA' },
                            home_score: 1,
                            away_score: 2,
                            date: '2021-10-10',
                            time: '20:45',
                            stadium: 'San Siro',
                            city: 'Milan',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'League B',
                standing_count: 16,
                stages: [
                  {
                    name: 'Group Stage',
                    type: 'roundrobin',
                    home_and_away: true,
                    multiple_matchdays: true,
                    advancement: {
                      auto: [1],
                      eliminated: [2, 3],
                      relegated: [4],
                      text: 'The top teams in League A would advance to the Nations League Finals. The top teams in leagues B, C and D would be promoted to the higher league. The last-placed teams in leagues A and B would be relegated to the lower league. The last-placed teams in league C would play in relegation play-outs to determine 2 to be relegated to league D.',
                    },
                    groups: [
                      {
                        name: 'Group 1',
                        teams: [{ id: 'NOR' }, { id: 'AUT' }, { id: 'ROU' }, { id: 'NIR' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [
                              {
                                home_team: { id: 'NOR' },
                                away_team: { id: 'AUT' },
                                home_score: 1,
                                away_score: 2,
                                date: '2020-09-04',
                                time: '20:45',
                                stadium: 'Ullevaal Stadion',
                                city: 'Oslo',
                              },
                            ],
                          },
                          {
                            name: 'Matchday 2',
                            matches: [],
                          },
                        ],
                      },
                      {
                        name: 'Group 2',
                        teams: [{ id: 'SCO' }, { id: 'ISR' }, { id: 'SVK' }, { id: 'CZE' }],
                        matchdays: [
                          {
                            name: 'Matchday 1',
                            matches: [],
                          },
                          {
                            name: 'Matchday 3',
                            matches: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { name: 'League C', standing_count: 32, stages: [] },
              { name: 'League D', standing_count: 48, stages: [] },
            ],
          },
        },
      ],
    },
  ],
}
