export const AppData = {
  collection: "tournament",
  batches: [
    {
      number: "1",
      rows: [
        {
          id: "USOPEN2017",
          data: {
            name: "2017 US Open",
            tournament_type_id: "",
            start_date: "2017-08-28",
            end_date: "2017-09-10",
            active: false
          }
        },
        {
          id: "USOPEN2018",
          data: {
            name: "2018 US Open",
            tournament_type_id: "",
            start_date: "2018-08-27",
            end_date: "2018-09-09",
            active: false
          }
        },
        {
          id: "NFL2018",
          data: {
            name: "National Football League 2018",
            tournament_type_id: "NFL",
            start_date: "2018-08-03",
            end_date: "2019-02-04",
            active: false
          }
        },
        {
          id: "USOPEN2017MS",
          data: {
            name: "2017 US Open Men's Singles",
            tournament_type_id: "ATP",
            start_date: "2017-08-28",
            end_date: "2017-09-10",
            active: false,
            logo_filename: "usopen.svg",
            parent_tournament_id: "USOPEN2017"
          }
        },
        {
          id: "USOPEN2018MS",
          data: {
            name: "2018 US Open Men's Singles",
            tournament_type_id: "ATP",
            start_date: "2018-08-27",
            end_date: "2018-09-09",
            active: false,
            logo_filename: "usopen.svg",
            parent_tournament_id: "USOPEN2018"
          }
        },
        {
          id: "USOPEN2018WS",
          data: {
            name: "2018 US Open Women's Singles",
            tournament_type_id: "WTA",
            start_date: "2018-08-27",
            end_date: "2018-09-09",
            active: false,
            logo_filename: "usopen.svg",
            parent_tournament_id: "USOPEN2018"
          }
        },
        {
          id: "UNL201819",
          data: {
            name: "2018/19 UEFA Nations League",
            tournament_type_id: "UNL",
            start_date: "2018-09-06",
            end_date: "2019-06-09",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "UEFA_Nations_League.png",
            points_for_win: 3
          }
        },
        {
          id: "UCL201819",
          data: {
            name: "2018/19 UEFA Champions League",
            tournament_type_id: "UCL",
            start_date: "2018-06-26",
            end_date: "2019-06-01",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: true,
            golden_goal_rule: false,
            logo_filename: "UCL.svg",
            points_for_win: 3
          }
        },
        {
          id: "UEL201819",
          data: {
            name: "2018/19 UEFA Europa League",
            tournament_type_id: "UEL",
            start_date: "2018-06-28",
            end_date: "2019-05-29",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "UEL.svg",
            points_for_win: 3
          }
        }
      ]
    },
    {
      number: "2",
      rows: [
        {
          id: "WC2018",
          data: {
            name: "2018 FIFA World Cup Russia",
            tournament_type_id: "WC",
            start_date: "2018-06-14",
            end_date: "2018-07-15",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2018.png",
            points_for_win: 3
          }
        },
        {
          id: "WC2014",
          data: {
            name: "2014 FIFA World Cup Brazil",
            tournament_type_id: "WC",
            start_date: "2014-06-12",
            end_date: "2014-07-13",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2014.png",
            points_for_win: 3
          }
        },
        {
          id: "WC2010",
          data: {
            name: "2010 FIFA World Cup South Africa",
            tournament_type_id: "WC",
            start_date: "2010-06-11",
            end_date: "2010-07-11",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2010.png",
            points_for_win: 3
          }
        },
        {
          id: "WC2006",
          data: {
            name: "2006 FIFA World Cup Germany",
            tournament_type_id: "WC",
            start_date: "2006-06-09",
            end_date: "2006-07-09",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2006.png",
            points_for_win: 3
          }
        },
        {
          id: "WC2002",
          data: {
            name: "2002 FIFA World Cup Korea-Japan",
            tournament_type_id: "WC",
            start_date: "2002-05-31",
            end_date: "2002-06-10",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "2002.png",
            points_for_win: 3
          }
        },
        {
          id: "WC1998",
          data: {
            name: "1998 FIFA World Cup France",
            tournament_type_id: "WC",
            start_date: "1998-06-10",
            end_date: "1998-07-12",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "1998.png",
            points_for_win: 3
          }
        },
        {
          id: "WC1994",
          data: {
            name: "1994 FIFA World Cup USA",
            tournament_type_id: "WC",
            start_date: "1994-06-17",
            end_date: "1994-07-17",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1994.png",
            points_for_win: 3
          }
        },
        {
          id: "WC1990",
          data: {
            name: "1990 FIFA World Cup Italy",
            tournament_type_id: "WC",
            start_date: "1990-06-08",
            end_date: "1990-07-08",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1990.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1986",
          data: {
            name: "1986 FIFA World Cup Mexico",
            tournament_type_id: "WC",
            start_date: "1986-05-31",
            end_date: "1986-06-29",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1986.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1982",
          data: {
            name: "1982 FIFA World Cup Spain",
            tournament_type_id: "WC",
            start_date: "1982-06-13",
            end_date: "1982-07-11",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1982.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1978",
          data: {
            name: "1978 FIFA World Cup Argentina",
            tournament_type_id: "WC",
            start_date: "1978-06-01",
            end_date: "1978-06-25",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1978.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1974",
          data: {
            name: "1974 FIFA World Cup Germany",
            tournament_type_id: "WC",
            start_date: "1974-06-13",
            end_date: "1974-07-07",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1974.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1970",
          data: {
            name: "1970 FIFA World Cup Mexico",
            tournament_type_id: "WC",
            start_date: "1970-05-31",
            end_date: "1970-06-21",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1970.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1966",
          data: {
            name: "1966 FIFA World Cup England",
            tournament_type_id: "WC",
            start_date: "1966-07-11",
            end_date: "1966-07-30",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1966.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1962",
          data: {
            name: "1962 FIFA World Cup Chile",
            tournament_type_id: "WC",
            start_date: "1962-05-30",
            end_date: "1962-06-17",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1962.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1958",
          data: {
            name: "1958 FIFA World Cup Sweden",
            tournament_type_id: "WC",
            start_date: "1958-06-08",
            end_date: "1958-06-29",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1958.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1954",
          data: {
            name: "1954 FIFA World Cup Switzerland",
            tournament_type_id: "WC",
            start_date: "1954-06-16",
            end_date: "1954-07-04",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1954.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1950",
          data: {
            name: "1950 FIFA World Cup Brazil",
            tournament_type_id: "WC",
            start_date: "1950-06-24",
            end_date: "1950-07-16",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1950.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1938",
          data: {
            name: "1938 FIFA World Cup France",
            tournament_type_id: "WC",
            start_date: "1938-06-04",
            end_date: "1938-06-19",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1938.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1934",
          data: {
            name: "1934 FIFA World Cup Italy",
            tournament_type_id: "WC",
            start_date: "1934-05-27",
            end_date: "1934-06-10",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1934.png",
            points_for_win: 2
          }
        },
        {
          id: "WC1930",
          data: {
            name: "1930 FIFA World Cup Uruguay",
            tournament_type_id: "WC",
            start_date: "1930-07-13",
            end_date: "1930-07-30",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1930.png",
            points_for_win: 2
          }
        }
      ]
    },
    {
      number: "3",
      rows: [
        {
          id: "WWC2015",
          data: {
            name: "2015 FIFA Women's World Cup Canada",
            tournament_type_id: "WWC",
            start_date: "2015-06-06",
            end_date: "2015-07-05",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2015.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC2011",
          data: {
            name: "2011 FIFA Women's World Cup Germany",
            tournament_type_id: "WWC",
            start_date: "2011-06-26",
            end_date: "2011-07-17",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2011.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC2007",
          data: {
            name: "2007 FIFA Women's World Cup China",
            tournament_type_id: "WWC",
            start_date: "2007-09-10",
            end_date: "2007-09-30",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2007.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC2003",
          data: {
            name: "2003 FIFA Women's World Cup USA",
            tournament_type_id: "WWC",
            start_date: "2003-09-20",
            end_date: "2003-10-12",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "2003.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC1999",
          data: {
            name: "1999 FIFA Women's World Cup USA",
            tournament_type_id: "WWC",
            start_date: "1999-06-19",
            end_date: "1999-07-10",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "1999.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC1995",
          data: {
            name: "1995 FIFA Women's World Cup Sweden",
            tournament_type_id: "WWC",
            start_date: "1995-06-05",
            end_date: "1995-06-18",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1995.png",
            points_for_win: 3
          }
        },
        {
          id: "WWC1991",
          data: {
            name: "1991 FIFA Women's World Cup China PR",
            tournament_type_id: "WWC",
            start_date: "1991-11-16",
            end_date: "1991-11-30",
            active: false,
            third_place_ranking: true,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1991.png",
            points_for_win: 2
          }
        }
      ]
    },
    {
      number: "4",
      rows: [
        {
          id: "OFT2016",
          data: {
            name: "Olympic Football Tournament Rio 2016",
            tournament_type_id: "OFT",
            start_date: "2016-08-03",
            end_date: "2016-08-20",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2016.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT2012",
          data: {
            name: "Olympic Football Tournament London 2012",
            tournament_type_id: "OFT",
            start_date: "2012-07-26",
            end_date: "2012-08-11",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2012.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT2008",
          data: {
            name: "Olympic Football Tournament Beijing 2008",
            tournament_type_id: "OFT",
            start_date: "2008-08-07",
            end_date: "2008-08-23",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2008.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT2004",
          data: {
            name: "Olympic Football Tournament Athens 2004",
            tournament_type_id: "OFT",
            start_date: "2004-08-11",
            end_date: "2004-08-28",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "2004.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT2000",
          data: {
            name: "Olympic Football Tournament Sydney 2000",
            tournament_type_id: "OFT",
            start_date: "2000-09-15",
            end_date: "2000-09-30",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "2000.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT1996",
          data: {
            name: "Olympic Football Tournament Atlanta 1996",
            tournament_type_id: "OFT",
            start_date: "1996-07-20",
            end_date: "1996-08-03",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: true,
            logo_filename: "1996.png",
            points_for_win: 3
          }
        },
        {
          id: "OFT1992",
          data: {
            name: "Olympic Football Tournament Barcelona 1992",
            tournament_type_id: "OFT",
            start_date: "1992-07-24",
            end_date: "1992-08-08",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1992.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1988",
          data: {
            name: "Olympic Football Tournament Seoul 1988",
            tournament_type_id: "OFT",
            start_date: "1988-09-17",
            end_date: "1988-10-01",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1988.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1984",
          data: {
            name: "Olympic Football Tournament Los Angeles 1984",
            tournament_type_id: "OFT",
            start_date: "1984-07-29",
            end_date: "1984-08-11",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1984.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1980",
          data: {
            name: "Olympic Football Tournament Moscow 1980",
            tournament_type_id: "OFT",
            start_date: "1980-07-20",
            end_date: "1980-08-02",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1980.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1976",
          data: {
            name: "Olympic Football Tournament Montreal 1976",
            tournament_type_id: "OFT",
            start_date: "1976-07-18",
            end_date: "1976-07-31",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1976.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1972",
          data: {
            name: "Olympic Football Tournament Munich 1972",
            tournament_type_id: "OFT",
            start_date: "1972-08-27",
            end_date: "1972-09-10",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1972.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1968",
          data: {
            name: "Olympic Football Tournament Mexico City 1968",
            tournament_type_id: "OFT",
            start_date: "1968-10-13",
            end_date: "1968-10-26",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1968.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1964",
          data: {
            name: "Olympic Football Tournament Tokyo 1964",
            tournament_type_id: "OFT",
            start_date: "1964-10-11",
            end_date: "1964-10-23",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1964.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1960",
          data: {
            name: "Olympic Football Tournament Roma 1960",
            tournament_type_id: "OFT",
            start_date: "1960-08-26",
            end_date: "1960-09-10",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1960.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1956",
          data: {
            name: "Olympic Football Tournament Melbourne 1956",
            tournament_type_id: "OFT",
            start_date: "1956-11-24",
            end_date: "1956-12-08",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1956.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1952",
          data: {
            name: "Olympic Football Tournament Helsinki 1952",
            tournament_type_id: "OFT",
            start_date: "1952-07-15",
            end_date: "1952-08-02",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1952.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1948",
          data: {
            name: "Olympic Football Tournament London 1948",
            tournament_type_id: "OFT",
            start_date: "1948-07-26",
            end_date: "1948-08-13",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1948.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1936",
          data: {
            name: "Olympic Football Tournament Berlin 1936",
            tournament_type_id: "OFT",
            start_date: "1936-08-03",
            end_date: "1936-08-15",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1936.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1928",
          data: {
            name: "Olympic Football Tournament Amsterdam 1928",
            tournament_type_id: "OFT",
            start_date: "1928-05-27",
            end_date: "1928-06-13",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1928.jpg",
            points_for_win: 2
          }
        },
        {
          id: "OFT1924",
          data: {
            name: "Olympic Football Tournament Paris 1924",
            tournament_type_id: "OFT",
            start_date: "1924-05-25",
            end_date: "1924-06-09",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1924.png",
            points_for_win: 2
          }
        },
        {
          id: "OFT1920",
          data: {
            name: "Olympic Football Tournament Antwerp 1920",
            tournament_type_id: "OFT",
            start_date: "1920-08-28",
            end_date: "1920-09-05",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1920.gif",
            points_for_win: 2
          }
        },
        {
          id: "OFT1912",
          data: {
            name: "Olympic Football Tournament Stockholm 1912",
            tournament_type_id: "OFT",
            start_date: "1912-06-29",
            end_date: "1912-07-04",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1912.gif",
            points_for_win: 2
          }
        },
        {
          id: "OFT1908",
          data: {
            name: "Olympic Football Tournament London 1908",
            tournament_type_id: "OFT",
            start_date: "1908-10-19",
            end_date: "1908-10-24",
            active: false,
            third_place_ranking: false,
            head_to_head_tiebreaker: false,
            golden_goal_rule: false,
            logo_filename: "1908.gif",
            points_for_win: 2
          }
        }
      ]
    }
  ]
};
