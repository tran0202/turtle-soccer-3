export const AppData = {
  collection: 'campaign',
  batches: [
    {
      number: '101',
      rows: [
        {
          id: 'COPA1916',
          data: {
            name: 'Final Tournament',
            tournament_id: 'COPA1916',
            description: 'Copa America 1916',
            order: 9,
            stages: [
              {
                name: 'Final Round',
                type: 'roundrobin',
                championship_round: true,
                eliminate_count: 0,
                advancement: { text: 'The winner would win the Copa America.' },
                groups: [
                  {
                    name: 'Final Round',
                    teams: [{ id: 'URU' }, { id: 'CHI' }, { id: 'ARG' }, { id: 'BRA' }],
                    matches: [
                      {
                        home_team: { id: 'URU' },
                        away_team: { id: 'CHI' },
                        home_score: 4,
                        away_score: 0,
                        date: '1916-07-02',
                        time: '12:00',
                        stadium: 'Gimnasia y Esgrima',
                        city: 'Buenos Aires',
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
