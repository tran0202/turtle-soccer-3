export const AppData = {
  collection: 'campaign',
  batches: [
    {
      number: '101',
      rows: [
        {
          id: 'COPA1919',
          data: {
            name: 'Final Tournament',
            tournament_id: 'COPA1919',
            description: 'Copa America 1919',
            order: 9,
            stages: [
              {
                name: 'Final Round',
                type: 'roundrobin',
                eliminate_count: 2,
                next_round: 'Final Playoff',
                advancement: {
                  auto: [1, 2],
                  eliminated: [3, 4],
                  text: "The winner would've won the Copa America. As Brazil and Uruguay finished tied on points in the final round, a playoff match was played between Brazil and Uruguay to determine the champion. Brazil eventually won the Final Playoff.",
                },
                groups: [
                  {
                    name: 'Final Round',
                    teams: [{ id: 'BRA' }, { id: 'CHI' }, { id: 'ARG' }, { id: 'URU' }],
                    matches: [
                      {
                        home_team: { id: 'BRA' },
                        away_team: { id: 'CHI' },
                        home_score: 6,
                        away_score: 0,
                        date: '1919-05-11',
                        time: '12:00',
                        stadium: 'Estádio das Laranjeiras',
                        city: 'Rio de Janeiro',
                      },
                      {
                        home_team: { id: 'ARG' },
                        away_team: { id: 'URU' },
                        home_score: 2,
                        away_score: 3,
                        date: '1919-05-13',
                        time: '12:00',
                        stadium: 'Estádio das Laranjeiras',
                        city: 'Rio de Janeiro',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Final Playoff',
                type: 'knockout',
                rounds: [
                  {
                    name: 'Final Playoff',
                    matches: [
                      {
                        home_team: { id: 'BRA' },
                        away_team: { id: 'URU' },
                        home_score: 0,
                        away_score: 0,
                        home_extra_score: 1,
                        away_extra_score: 0,
                        date: '1919-05-29',
                        time: '12:00',
                        stadium: 'Estádio das Laranjeiras',
                        city: 'Rio de Janeiro',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
}
