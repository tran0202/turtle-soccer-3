export const AppData = {
  collection: 'campaign',
  batches: [
    {
      number: '1',
      rows: [
        {
          id: 'WC2018',
          data: {
            name: 'Final Tournament',
            tournament_id: 'WC2018',
            description: 'World Cup 2018 Final Tournament',
            order: 9,
            stages: [
              {
                name: 'Group Stage',
                type: 'roundrobin',
                groups: [
                  {
                    name: 'Group A',
                    teams: [{ id: 'RUS' }, { id: 'URU' }, { id: 'EGY' }, { id: 'KSA' }],
                    matches: [
                      {
                        home_team: 'RUS',
                        away_team: 'KSA',
                        home_score: 5,
                        away_score: 0,
                        date: '2018-06-14',
                        time: '18:00',
                        stadium: 'Luzhniki Stadium',
                        city: 'Moscow',
                      },
                    ],
                  },
                ],
              },
              { name: 'Knockout Stage' },
            ],
          },
        },
      ],
    },
    {
      number: '2',
      rows: [
        {
          id: 'WC2022_ALLQ',
          data: {
            name: 'Overall Qualification',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 Overall Qualification',
            order: 1,
            details: {
              logo_filename: '640px-FIFA_logo_without_slogan.svg.png',
              start_date: '2019-06-06',
              end_date: '2022-06-14',
              color: '#cc0000',
              team_count: 207,
              confed_count: 6,
            },
            statistics: { total_matches: 765, total_goals: 2197, attendance: 6789008 },
            awards: {
              golden_boot: [{ name: 'Ali Mabkhout', team: 'UAE', goals: 14 }],
            },
          },
        },
        {
          id: 'WC2022_AFCQ',
          data: {
            name: 'AFC Asian Qualifiers',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 AFC Asian Qualifiers',
            order: 2,
            details: {
              logo_filename: 'AFC_Asian_Qualifiers.png',
              start_date: '2019-06-06',
              end_date: '2022-06-01',
              color: '#e5cf1d',
              team_count: 46,
              confed_count: 1,
            },
            statistics: { total_matches: 204, total_goals: 626, attendance: 1940722 },
            awards: {
              golden_boot: [{ name: 'Ali Mabkhout', team: 'UAE', goals: 14 }],
            },
          },
        },
        {
          id: 'WC2022_CAFQ',
          data: {
            name: 'CAF Qualification',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 CAF Qualification',
            order: 3,
            details: {
              logo_filename: 'Confederation_of_African_Football_logo.png',
              start_date: '2019-09-04',
              end_date: '2022-03-01',
              color: '#000000',
              team_count: 54,
              confed_count: 1,
            },
            statistics: { total_matches: 148, total_goals: 345, attendance: 769510 },
            awards: {
              golden_boot: [{ name: 'Islam Slimani', team: 'ALG', goals: 7 }],
            },
          },
        },
        {
          id: 'WC2022_CONCACAFQ',
          data: {
            name: 'CONCACAF Qualifiers',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 CONCACAF Qualifiers',
            order: 4,
            details: {
              logo_filename: 'CONCACAF_qualifiers_-_Road_to_Qatar_-_Logo_480x494.png',
              start_date: '2021-03-24',
              end_date: '2022-03-30',
              color: '#cc0000',
              team_count: 34,
              confed_count: 1,
            },
            statistics: { total_matches: 94, total_goals: 295, attendance: 698674 },
            awards: {
              golden_boot: [{ name: 'Cyle Larin', team: 'CAN', goals: 11 }],
            },
          },
        },
        {
          id: 'WC2022_CONMEBOLQ',
          data: {
            name: 'CONMEBOL Qualification',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 CONMEBOL Qualification',
            order: 5,
            details: {
              logo_filename: 'CONMEBOL_logo_(2017).png',
              start_date: '2020-10-08',
              end_date: '2022-03-29',
              color: '#cc0000',
              team_count: 10,
              confed_count: 1,
            },
            statistics: { total_matches: 69, total_goals: 168, attendance: 689954 },
            awards: {
              golden_boot: [{ name: 'Marcelo Moreno', team: 'BOL', goals: 9 }],
            },
          },
        },
        {
          id: 'WC2022_OFCQ',
          data: {
            name: 'OFC Qualification',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 OFC Qualification',
            order: 6,
            details: {
              host: ['QAT'],
              logo_filename: 'Oceania_Football_Confederation_logo.png',
              start_date: '2022-03-13',
              end_date: '2022-03-30',
              color: '#cc0000',
              team_count: 9,
              confed_count: 1,
            },
          },
        },
        {
          id: 'WC2022_UEFAQ',
          data: {
            name: 'European Qualifiers',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 European Qualifiers',
            order: 7,
            details: {
              logo_filename: 'UEFA_Euro_2016_qualifying.png',
              start_date: '2021-03-24',
              end_date: '2022-03-29',
              color: '#cc0000',
              team_count: 55,
              confed_count: 1,
            },
            statistics: { total_matches: 250, total_goals: 763, attendance: 2690148 },
            awards: {
              golden_boot: [
                { name: 'Harry Kane', team: 'ENG', goals: 12 },
                { name: 'Memphis Depay', team: 'NED', goals: 12 },
              ],
            },
          },
        },
        {
          id: 'WC2022_ICPO',
          data: {
            name: 'Inter-confederation play-offs',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 Inter-confederation play-offs',
            order: 8,
            details: {
              host: ['QAT'],
              logo_filename: '640px-FIFA_logo_without_slogan.svg.png',
              start_date: '2022-06-13',
              end_date: '2022-06-14',
              color: '#cc0000',
              team_count: 4,
              confed_count: 4,
            },
          },
        },
        {
          id: 'WC2022',
          data: {
            name: 'Final Tournament',
            tournament_id: 'WC2022',
            description: 'World Cup 2022 Final Tournament',
            order: 9,
            stages: [{ name: 'Group Stage' }, { name: 'Knockout Stage' }],
          },
        },
        {
          id: 'WC2018_AFCQ',
          data: {
            name: 'AFC Asian Qualifiers',
            tournament_id: 'WC2018',
            description: 'World Cup 2018 AFC Asian Qualifiers',
            order: 1,
            details: { logo_filename: 'AFC_Asian_Qualifiers.png' },
          },
        },
        {
          id: 'WC2018',
          data: {
            name: 'Final Tournament',
            tournament_id: 'WC2018',
            description: 'World Cup 2018 Final Tournament',
            order: 9,
            stages: [{ name: 'Group Stage' }, { name: 'Knockout Stage' }],
          },
        },
        {
          id: 'WC2014',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC2014',
            description: 'World Cup 2014 Final Tournament',
            order: 9,
            stages: [{ name: 'Group Stage' }],
          },
        },
        {
          id: 'WC2010',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC2010',
            description: 'World Cup 2010 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC2006',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC2006',
            description: 'World Cup 2006 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC2002',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC2002',
            description: 'World Cup 2002 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1998',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1998',
            description: 'World Cup 1998 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1994',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1994',
            description: 'World Cup 1994 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1990',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1990',
            description: 'World Cup 1990 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1986',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1986',
            description: 'World Cup 1986 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1982',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1982',
            description: 'World Cup 1982 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1978',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1978',
            description: 'World Cup 1978 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1974',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1974',
            description: 'World Cup 1974 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1970',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1970',
            description: 'World Cup 1970 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1966',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1966',
            description: 'World Cup 1966 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1962',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1962',
            description: 'World Cup 1962 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1958',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1958',
            description: 'World Cup 1958 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1954',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1954',
            description: 'World Cup 1954 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1950',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1950',
            description: 'World Cup 1950 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1938',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1938',
            description: 'World Cup 1938 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1934',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1934',
            description: 'World Cup 1934 Final Tournament',
            order: 9,
          },
        },
        {
          id: 'WC1930',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WC1930',
            description: 'World Cup 1930 Final Tournament',
            order: 9,
          },
        },
      ],
    },
    {
      number: '3',
      rows: [
        {
          id: 'WWC2019',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC2019',
            description: "Women's World Cup 2019 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC2015',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC2015',
            description: "Women's World Cup 2015 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC2011',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC2011',
            description: "Women's World Cup 2011 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC2007',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC2007',
            description: "Women's World Cup 2007 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC2003',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC2003',
            description: "Women's World Cup 2003 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC1999',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC1999',
            description: "Women's World Cup 1999 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC1995',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC1995',
            description: "Women's World Cup 1995 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WWC1991',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WWC1991',
            description: "Women's World Cup 1991 Final Tournament",
            order: 9,
          },
        },
      ],
    },
    {
      number: '4',
      rows: [
        {
          id: 'MOFT2020',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2020',
            description: "Men's Olympic 2020 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT2016',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2016',
            description: "Men's Olympic 2016 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT2012',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2012',
            description: "Men's Olympic 2012 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT2008',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2008',
            description: "Men's Olympic 2008 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT2004',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2004',
            description: "Men's Olympic 2004 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT2000',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT2000',
            description: "Men's Olympic 2000 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1996',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1996',
            description: "Men's Olympic 1996 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1992',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1992',
            description: "Men's Olympic 1992 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1988',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1988',
            description: "Men's Olympic 1988 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1984',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1984',
            description: "Men's Olympic 1984 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1980',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1980',
            description: "Men's Olympic 1980 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1976',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1976',
            description: "Men's Olympic 1976 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1972',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1972',
            description: "Men's Olympic 1972 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1968',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1968',
            description: "Men's Olympic 1968 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1964',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1964',
            description: "Men's Olympic 1964 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1960',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1960',
            description: "Men's Olympic 1960 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1956',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1956',
            description: "Men's Olympic 1956 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1952',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1952',
            description: "Men's Olympic 1952 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1948',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1948',
            description: "Men's Olympic 1948 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1936',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1936',
            description: "Men's Olympic 1936 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1928',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1928',
            description: "Men's Olympic 1928 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1924',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1924',
            description: "Men's Olympic 1924 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1920',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1920',
            description: "Men's Olympic 1920 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1912',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1912',
            description: "Men's Olympic 1912 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'MOFT1908',
          data: {
            name: 'Tournamnt',
            tournament_id: 'MOFT1908',
            description: "Men's Olympic 1908 Final Tournament",
            order: 9,
          },
        },
      ],
    },
    {
      number: '5',
      rows: [
        {
          id: 'WOFT2020',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2020',
            description: "Women's Olympic 2020 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT2016',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2016',
            description: "Women's Olympic 2016 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT2012',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2012',
            description: "Women's Olympic 2012 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT2008',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2008',
            description: "Women's Olympic 2008 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT2004',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2004',
            description: "Women's Olympic 2004 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT2000',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT2000',
            description: "Women's Olympic 2000 Final Tournament",
            order: 9,
          },
        },
        {
          id: 'WOFT1996',
          data: {
            name: 'Tournamnt',
            tournament_id: 'WOFT1996',
            description: "Women's Olympic 1996 Final Tournament",
            order: 9,
          },
        },
      ],
    },
    {
      number: '6',
      rows: [
        {
          id: 'CONFEDC2017',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2017',
            description: 'Confederations Cup 2017',
            order: 9,
          },
        },
        {
          id: 'CONFEDC2013',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2013',
            description: 'Confederations Cup 2013',
            order: 9,
          },
        },
        {
          id: 'CONFEDC2009',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2009',
            description: 'Confederations Cup 2009',
            order: 9,
          },
        },
        {
          id: 'CONFEDC2005',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2005',
            description: 'Confederations Cup 2005',
            order: 9,
          },
        },
        {
          id: 'CONFEDC2003',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2003',
            description: 'Confederations Cup 2003',
            order: 9,
          },
        },
        {
          id: 'CONFEDC2001',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC2001',
            description: 'Confederations Cup 2001',
            order: 9,
          },
        },
        {
          id: 'CONFEDC1999',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC1999',
            description: 'Confederations Cup 1999',
            order: 9,
          },
        },
        {
          id: 'CONFEDC1997',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC1997',
            description: 'Confederations Cup 1997',
            order: 9,
          },
        },
        {
          id: 'CONFEDC1995',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC1995',
            description: 'Confederations Cup 1995',
            order: 9,
          },
        },
        {
          id: 'CONFEDC1992',
          data: {
            name: 'Tournamnt',
            tournament_id: 'CONFEDC1992',
            description: 'Confederations Cup 1992',
            order: 9,
          },
        },
      ],
    },
  ],
}
