export const AppData = {
  collection: 'campaign',
  batches: [
    {
      number: '12',
      rows: [
        {
          id: 'COPA2021',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2021',
            description: 'Copa America 2021',
            order: 9,
          },
        },
        {
          id: 'COPA2019',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2019',
            description: 'Copa America 2019',
            order: 9,
          },
        },
        {
          id: 'COPA2016',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2016',
            description: 'Copa America 2016',
            order: 9,
          },
        },
        {
          id: 'COPA2015',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2015',
            description: 'Copa America 2015',
            order: 9,
          },
        },
        {
          id: 'COPA2011',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2011',
            description: 'Copa America 2011',
            order: 9,
          },
        },
        {
          id: 'COPA2007',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2007',
            description: 'Copa America 2007',
            order: 9,
          },
        },
        {
          id: 'COPA2004',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2004',
            description: 'Copa America 2004',
            order: 9,
          },
        },
        {
          id: 'COPA2001',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA2001',
            description: 'Copa America 2001',
            order: 9,
          },
        },
        {
          id: 'COPA1999',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1999',
            description: 'Copa America 1999',
            order: 9,
          },
        },
        {
          id: 'COPA1997',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1997',
            description: 'Copa America 1997',
            order: 9,
          },
        },
        {
          id: 'COPA1995',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1995',
            description: 'Copa America 1995',
            order: 9,
          },
        },
        {
          id: 'COPA1993',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1993',
            description: 'Copa America 1993',
            order: 9,
          },
        },
        {
          id: 'COPA1991',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1991',
            description: 'Copa America 1991',
            order: 9,
          },
        },
        {
          id: 'COPA1989',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1989',
            description: 'Copa America 1989',
            order: 9,
          },
        },
        {
          id: 'COPA1987',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1987',
            description: 'Copa America 1987',
            order: 9,
          },
        },
        {
          id: 'COPA1983',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1983',
            description: 'Copa America 1983',
            order: 9,
          },
        },
        {
          id: 'COPA1979',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1979',
            description: 'Copa America 1979',
            order: 9,
          },
        },
        {
          id: 'COPA1975',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1975',
            description: 'Copa America 1975',
            order: 9,
          },
        },
        {
          id: 'COPA1967',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1967',
            description: 'Copa America 1967',
            order: 9,
          },
        },
        {
          id: 'COPA1963',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1963',
            description: 'Copa America 1963',
            order: 9,
          },
        },
        {
          id: 'COPA1959ECU',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1959ECU',
            description: 'Copa America 1959 Ecuador',
            order: 9,
          },
        },
        {
          id: 'COPA1959ARG',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1959ARG',
            description: 'Copa America 1959 Argentina',
            order: 9,
          },
        },
        {
          id: 'COPA1957',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1957',
            description: 'Copa America 1957',
            order: 9,
          },
        },
        {
          id: 'COPA1956',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1956',
            description: 'Copa America 1956',
            order: 9,
          },
        },
        {
          id: 'COPA1955',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1955',
            description: 'Copa America 1955',
            order: 9,
          },
        },
        {
          id: 'COPA1953',
          data: {
            name: 'Tournament',
            tournament_id: 'COPA1953',
            description: 'Copa America 1953',
            order: 9,
            stages: [
              {
                name: 'Final Round',
                type: 'roundrobin',
                eliminate_count: 2,
                next_round: 'Final Playoff',
                advancement: {
                  auto: [1, 2],
                  eliminated: [3, 4, 5, 6, 7],
                  text: "The winner would've won the Copa America. As Paraguay and Brazil finished tied on points in the final round, a playoff match was played between Paraguay and Brazil to determine the champion. Paraguay eventually won the Final Playoff.",
                },
                groups: [
                  {
                    name: 'Final Round',
                    teams: [{ id: 'BOL' }, { id: 'PER' }, { id: 'PAR' }, { id: 'CHI' }, { id: 'URU' }, { id: 'ECU' }, { id: 'BRA' }],
                    matches: [
                      {
                        home_team: { id: 'PER' },
                        away_team: { id: 'PAR' },
                        home_score: 2,
                        away_score: 2,
                        home_awarded: true,
                        awarded_text:
                          'Match was awarded (2 pts) to Peru due to unsportsmanlike behaviour of Paraguay by making one extra change. Scores remained unchanged.',
                        date: '1953-03-08',
                        time: '15:00',
                        stadium: 'Estadio Nacional',
                        city: 'Lima',
                      },
                      {
                        home_team: { id: 'CHI' },
                        away_team: { id: 'BOL' },
                        home_score: 2,
                        away_score: 2,
                        home_awarded: true,
                        awarded_text:
                          'Match was suspended after 66th min, and awarded (2 pts) to Chile due to unsportsmanlike behaviour of Bolivia. Scores remained unchanged.',
                        date: '1953-03-28',
                        time: '12:00',
                        stadium: 'Estadio Nacional',
                        city: 'Lima',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'COPA1949',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1949',
            description: 'Copa America 1949',
            order: 9,
          },
        },
        {
          id: 'COPA1947',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1947',
            description: 'Copa America 1947',
            order: 9,
          },
        },
        {
          id: 'COPA1946',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1946',
            description: 'Copa America 1946',
            order: 9,
          },
        },
        {
          id: 'COPA1945',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1945',
            description: 'Copa America 1945',
            order: 9,
          },
        },
        {
          id: 'COPA1942',
          data: {
            name: 'Tournament',
            tournament_id: 'COPA1942',
            description: 'Copa America 1942',
            order: 9,
            stages: [
              {
                name: 'Final Round',
                type: 'roundrobin',
                championship_round: true,
                advancement: { text: 'The winner would win the Copa America.' },
                groups: [
                  {
                    name: 'Final Round',
                    teams: [{ id: 'URU' }, { id: 'CHI' }, { id: 'ARG' }, { id: 'PAR' }, { id: 'BRA' }, { id: 'PER' }, { id: 'ECU' }],
                    matches: [
                      {
                        home_team: { id: 'ARG' },
                        away_team: { id: 'CHI' },
                        home_score: 0,
                        away_score: 0,
                        home_awarded: true,
                        awarded_text:
                          'Chile left the pitch on the 43rd minute in protest of the dreadful referee performance. Argentina was awarded a victory (2 pts) but with no goals.',
                        date: '1942-01-31',
                        time: '12:00',
                        stadium: 'Estadio Centenario',
                        city: 'Montevideo',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'COPA1941',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1941',
            description: 'Copa America 1941',
            order: 9,
          },
        },
        {
          id: 'COPA1939',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1939',
            description: 'Copa America 1939',
            order: 9,
          },
        },
        {
          id: 'COPA1937',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1937',
            description: 'Copa America 1937',
            order: 9,
          },
        },
        {
          id: 'COPA1935',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1935',
            description: 'Copa America 1935',
            order: 9,
          },
        },
        {
          id: 'COPA1929',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1929',
            description: 'Copa America 1929',
            order: 9,
          },
        },
        {
          id: 'COPA1927',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1927',
            description: 'Copa America 1927',
            order: 9,
          },
        },
        {
          id: 'COPA1926',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1926',
            description: 'Copa America 1926',
            order: 9,
          },
        },
        {
          id: 'COPA1925',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1925',
            description: 'Copa America 1925',
            order: 9,
          },
        },
        {
          id: 'COPA1924',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1924',
            description: 'Copa America 1924',
            order: 9,
          },
        },
        {
          id: 'COPA1923',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1923',
            description: 'Copa America 1923',
            order: 9,
          },
        },
        {
          id: 'COPA1922',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1922',
            description: 'Copa America 1922',
            order: 9,
          },
        },
        {
          id: 'COPA1921',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1921',
            description: 'Copa America 1921',
            order: 9,
          },
        },
        {
          id: 'COPA1920',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1920',
            description: 'Copa America 1920',
            order: 9,
          },
        },
        {
          id: 'COPA1919',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1919',
            description: 'Copa America 1919',
            order: 9,
          },
        },
        {
          id: 'COPA1917',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1917',
            description: 'Copa America 1917',
            order: 9,
          },
        },
        {
          id: 'COPA1916',
          data: {
            name: 'Tournamnt',
            tournament_id: 'COPA1916',
            description: 'Copa America 1916',
            order: 9,
          },
        },
      ],
    },
    {
      number: '13',
      rows: [
        {
          id: 'GC2021',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2021',
            description: 'Gold Cup 2021 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2019',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2019',
            description: 'Gold Cup 2019 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2017',
          data: {
            name: 'Tournament',
            tournament_id: 'GC2017',
            description: 'Gold Cup 2017 Final Tournament',
            order: 9,
            stages: [
              {
                name: 'Group Stage',
                type: 'roundrobin',
                eliminate_count: 8,
                next_round: 'Quarter-finals',
                advancement: {
                  auto: [1, 2],
                  wild_card: { pos: 3, count: 2 },
                  eliminated: [4],
                  text: 'The top 2 teams and the 2 best third-placed teams would advance to the Quarter-finals.',
                },
                groups: [
                  {
                    name: 'Group A',
                    teams: [{ id: 'GUF' }, { id: 'CAN' }, { id: 'HON' }, { id: 'CRC' }],
                    matches: [
                      {
                        home_team: { id: 'HON' },
                        away_team: { id: 'GUF' },
                        home_score: 0,
                        away_score: 0,
                        home_awarded_score: 3,
                        away_awarded_score: 0,
                        awarded_match: true,
                        awarded_text:
                          'Awarded: CONCACAF awarded Honduras a 3–0 win as a result of French Guiana fielding the ineligible player Florent Malouda, after the match had finished 0–0. Malouda had previously represented France and did not meet eligibility rules.',
                        date: '2017-07-11',
                        time: '22:00',
                        stadium: 'BBVA Stadium',
                        city: 'Houston',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'GC2015',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2015',
            description: 'Gold Cup 2015 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2013',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2013',
            description: 'Gold Cup 2013 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2011',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2011',
            description: 'Gold Cup 2011 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2009',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2009',
            description: 'Gold Cup 2009 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2007',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2007',
            description: 'Gold Cup 2007 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2005',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2005',
            description: 'Gold Cup 2005 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2003',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2003',
            description: 'Gold Cup 2003 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2002',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2002',
            description: 'Gold Cup 2002 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC2000',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC2000',
            description: 'Gold Cup 2000 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1998',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1998',
            description: 'Gold Cup 1998 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1996',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1996',
            description: 'Gold Cup 1996 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1993',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1993',
            description: 'Gold Cup 1993 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1991',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1991',
            description: 'Gold Cup 1991 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1989',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1989',
            description: 'Gold Cup 1989 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1985',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1985',
            description: 'Gold Cup 1985 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1981',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1981',
            description: 'Gold Cup 1981 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1977',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1977',
            description: 'Gold Cup 1977 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1973',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1973',
            description: 'Gold Cup 1973 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1971',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1971',
            description: 'Gold Cup 1971 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1969',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1969',
            description: 'Gold Cup 1969 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1967',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1967',
            description: 'Gold Cup 1967 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1965',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1965',
            description: 'Gold Cup 1965 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'GC1963',
          data: {
            name: 'Tournamnt',
            tournament_id: 'GC1963',
            description: 'Gold Cup 1963 Final Tournament',
            order: 9,
          },
        },
      ],
    },
    {
      number: '14',
      rows: [
        {
          id: 'AFCON2019',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2019',
            description: 'Africa Cup of Nations 2019 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2017',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2017',
            description: 'Africa Cup of Nations 2017 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2015',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2015',
            description: 'Africa Cup of Nations 2015 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2013',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2013',
            description: 'Africa Cup of Nations 2013 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2012',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2012',
            description: 'Africa Cup of Nations 2012 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2010',
          data: {
            name: 'Tournament',
            tournament_id: 'AFCON2010',
            description: 'Africa Cup of Nations 2010 Final Tournament',
            order: 9,
            stages: [
              {
                name: 'Group Stage',
                type: 'roundrobin',
                eliminate_count: 8,
                next_round: 'Quarter-finals',
                advancement: { auto: [1, 2], eliminated: [3, 4], text: 'The top 2 teams would advance to the Quarter-finals.' },
                groups: [
                  {
                    name: 'Group B',
                    teams: [{ id: 'CIV' }, { id: 'BFA' }, { id: 'GHA' }, { id: 'TOG' }],
                    matches: [
                      {
                        home_team: { id: 'GHA' },
                        away_team: { id: 'TOG' },
                        cancelled_match: true,
                        cancelled_text: 'Togo withdrew from the tournament after a terrorist attack on their bus',
                        away_withdrew: true,
                        date: '2010-01-11',
                        time: '19:30',
                        stadium: 'Estádio do Chiazi',
                        city: 'Cabinda',
                      },
                      {
                        home_team: { id: 'BFA' },
                        away_team: { id: 'TOG' },
                        cancelled_match: true,
                        cancelled_text: 'Togo withdrew from the tournament after a terrorist attack on their bus',
                        away_withdrew: true,
                        date: '2010-01-15',
                        time: '17:00',
                        stadium: 'Estádio do Chiazi',
                        city: 'Cabinda',
                      },
                      {
                        home_team: { id: 'CIV' },
                        away_team: { id: 'TOG' },
                        cancelled_match: true,
                        cancelled_text: 'Togo withdrew from the tournament after a terrorist attack on their bus',
                        away_withdrew: true,
                        date: '2010-01-19',
                        time: '17:00',
                        stadium: 'Estádio do Chiazi',
                        city: 'Cabinda',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Knockout Stage',
                type: 'knockout',
                rounds: [
                  {
                    name: 'Quarter-finals',
                    short_name: '1/4',
                    eliminate_count: 4,
                    next_round: 'Semi-finals',
                    matches: [],
                  },
                  {
                    name: 'Final',
                    short_name: '1st',
                    matches: [],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'AFCON2008',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2008',
            description: 'Africa Cup of Nations 2008 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2006',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2006',
            description: 'Africa Cup of Nations 2006 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2004',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2004',
            description: 'Africa Cup of Nations 2004 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2002',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2002',
            description: 'Africa Cup of Nations 2002 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON2000',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON2000',
            description: 'Africa Cup of Nations 2000 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1998',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1998',
            description: 'Africa Cup of Nations 1998 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1996',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1996',
            description: 'Africa Cup of Nations 1996 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1994',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1994',
            description: 'Africa Cup of Nations 1994 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1992',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1992',
            description: 'Africa Cup of Nations 1992 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1990',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1990',
            description: 'Africa Cup of Nations 1990 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1988',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1988',
            description: 'Africa Cup of Nations 1988 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1986',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1986',
            description: 'Africa Cup of Nations 1986 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1984',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1984',
            description: 'Africa Cup of Nations 1984 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1982',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1982',
            description: 'Africa Cup of Nations 1982 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1980',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1980',
            description: 'Africa Cup of Nations 1980 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1978',
          data: {
            name: 'Tournament',
            tournament_id: 'AFCON1978',
            description: 'Africa Cup of Nations 1978 Final Tournament',
            order: 9,
            stages: [
              { name: 'Group Stage' },
              {
                name: 'Knockout Stage',
                type: 'knockout',
                hide_bracket: true,
                rounds: [
                  {
                    name: 'Third-place',
                    short_name: '3rd',
                    matches: [
                      {
                        home_team: { id: 'NGA' },
                        away_team: { id: 'TUN' },
                        home_score: 1,
                        away_score: 1,
                        home_awarded_score: 2,
                        away_awarded_score: 0,
                        awarded_match: true,
                        awarded_text:
                          'Awarded: The match was abandoned after Tunisia walked off in the 42nd minute with the score tied at 1-1 to protest the officiating. Nigeria were awarded a 2-0 win.',
                        date: '1978-03-16',
                        time: '12:00',
                        stadium: 'Accra Sports Stadium',
                        city: 'Accra',
                      },
                    ],
                  },
                  {
                    name: 'Final',
                    short_name: '1st',
                    matches: [
                      {
                        home_team: { id: 'UGA' },
                        away_team: { id: 'GHA' },
                        home_score: 0,
                        away_score: 2,
                        date: '1978-03-16',
                        time: '15:00',
                        stadium: 'Accra Sports Stadium',
                        city: 'Accra',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'AFCON1976',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1976',
            description: 'Africa Cup of Nations 1976 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1974',
          data: {
            name: 'Tournament',
            tournament_id: 'AFCON1974',
            description: 'Africa Cup of Nations 1974 Final Tournament',
            order: 9,
            stages: [
              {
                name: 'Knockout Stage',
                type: 'knockout',
                rounds: [
                  {
                    name: 'Final',
                    short_name: '1st',
                    matches: [
                      {
                        home_team: { id: 'ZAI' },
                        away_team: { id: 'ZAM' },
                        home_score: 1,
                        away_score: 1,
                        home_extra_score: 1,
                        away_extra_score: 1,
                        date: '1974-03-12',
                        time: '12:00',
                        stadium: 'Cairo International Stadium',
                        city: 'Cairo',
                        replay_home_team: { id: 'ZAI' },
                        replay_away_team: { id: 'ZAM' },
                        replay_home_score: 2,
                        replay_away_score: 0,
                        replay_date: '1974-03-14',
                        replay_time: '12:00',
                        replay_stadium: 'Cairo International Stadium',
                        replay_city: 'Cairo',
                        replay_match: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'AFCON1972',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1972',
            description: 'Africa Cup of Nations 1972 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1970',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1970',
            description: 'Africa Cup of Nations 1970 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1968',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1968',
            description: 'Africa Cup of Nations 1968 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1965',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1965',
            description: 'Africa Cup of Nations 1965 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1963',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1963',
            description: 'Africa Cup of Nations 1963 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1962',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1962',
            description: 'Africa Cup of Nations 1962 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1959',
          data: {
            name: 'Tournamnt',
            tournament_id: 'AFCON1959',
            description: 'Africa Cup of Nations 1959 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'AFCON1957',
          data: {
            name: 'Tournament',
            tournament_id: 'AFCON1957',
            description: 'Africa Cup of Nations 1957 Final Tournament',
            order: 9,
            stages: [
              {
                name: 'Final tournament',
                type: 'knockout',
                rounds: [
                  {
                    name: 'Semi-finals',
                    short_name: '1/2',
                    eliminate_count: 2,
                    next_round: 'Final',
                    teams: [{ id: 'SDN-1956-1970' }, { id: 'EGY-1953-1958' }, { id: 'ETH-1941-1974' }, { id: 'RSA-1928-1994' }],
                    matches: [
                      {
                        home_team: { id: 'ETH-1941-1974' },
                        away_team: { id: 'RSA-1928-1994' },
                        walkover_match: true,
                        home_walkover: true,
                        walkover_text: 'Walkover: South Africa was disqualified due to apartheid. Ethiopia therefore had a bye to the final.',
                        date: '1957-02-10',
                        time: '15:00',
                        stadium: 'Municipal Stadium',
                        city: 'Khartoum',
                        bracket_order: 2,
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