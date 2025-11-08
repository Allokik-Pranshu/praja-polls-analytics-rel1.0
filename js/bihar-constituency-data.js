// Bihar Constituency mock data
const biharConstituencyData = [
    {
        "sno": 1,
        "district": "Patna",
        "constituency": "Patna Sahib",
        "expectedWinningParty": "BJP",
        "expectedVotes": 145000,
        "winningMargin": 25000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 120000
    },
    {
        "sno": 2,
        "district": "Patna",
        "constituency": "Patliputra",
        "expectedWinningParty": "BJP",
        "expectedVotes": 152000,
        "winningMargin": 32000,
        "runnerUpParty": "Congress",
        "runnerUpVotes": 120000
    },
    {
        "sno": 3,
        "district": "Patna",
        "constituency": "Bankipur",
        "expectedWinningParty": "BJP",
        "expectedVotes": 138000,
        "winningMargin": 18000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 120000
    },
    {
        "sno": 4,
        "district": "Gaya",
        "constituency": "Gaya",
        "expectedWinningParty": "BJP",
        "expectedVotes": 165000,
        "winningMargin": 35000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 5,
        "district": "Gaya",
        "constituency": "Aurangabad",
        "expectedWinningParty": "JDU",
        "expectedVotes": 142000,
        "winningMargin": 22000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 120000
    },
    {
        "sno": 6,
        "district": "Muzaffarpur",
        "constituency": "Muzaffarpur",
        "expectedWinningParty": "BJP",
        "expectedVotes": 158000,
        "winningMargin": 28000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 7,
        "district": "Muzaffarpur",
        "constituency": "Vaishali",
        "expectedWinningParty": "RJD",
        "expectedVotes": 148000,
        "winningMargin": 18000,
        "runnerUpParty": "BJP",
        "runnerUpVotes": 130000
    },
    {
        "sno": 8,
        "district": "Darbhanga",
        "constituency": "Darbhanga",
        "expectedWinningParty": "JDU",
        "expectedVotes": 155000,
        "winningMargin": 25000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 9,
        "district": "Darbhanga",
        "constituency": "Madhubani",
        "expectedWinningParty": "RJD",
        "expectedVotes": 162000,
        "winningMargin": 32000,
        "runnerUpParty": "BJP",
        "runnerUpVotes": 130000
    },
    {
        "sno": 10,
        "district": "Bhagalpur",
        "constituency": "Bhagalpur",
        "expectedWinningParty": "BJP",
        "expectedVotes": 168000,
        "winningMargin": 38000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 11,
        "district": "Bhagalpur",
        "constituency": "Banka",
        "expectedWinningParty": "JDU",
        "expectedVotes": 145000,
        "winningMargin": 15000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 12,
        "district": "Purnia",
        "constituency": "Purnia",
        "expectedWinningParty": "RJD",
        "expectedVotes": 152000,
        "winningMargin": 22000,
        "runnerUpParty": "JDU",
        "runnerUpVotes": 130000
    },
    {
        "sno": 13,
        "district": "Purnia",
        "constituency": "Katihar",
        "expectedWinningParty": "BJP",
        "expectedVotes": 158000,
        "winningMargin": 28000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 14,
        "district": "Araria",
        "constituency": "Araria",
        "expectedWinningParty": "RJD",
        "expectedVotes": 148000,
        "winningMargin": 18000,
        "runnerUpParty": "JDU",
        "runnerUpVotes": 130000
    },
    {
        "sno": 15,
        "district": "Kishanganj",
        "constituency": "Kishanganj",
        "expectedWinningParty": "Congress",
        "expectedVotes": 142000,
        "winningMargin": 12000,
        "runnerUpParty": "BJP",
        "runnerUpVotes": 130000
    },
    {
        "sno": 16,
        "district": "Saharsa",
        "constituency": "Saharsa",
        "expectedWinningParty": "RJD",
        "expectedVotes": 155000,
        "winningMargin": 25000,
        "runnerUpParty": "JDU",
        "runnerUpVotes": 130000
    },
    {
        "sno": 17,
        "district": "Madhepura",
        "constituency": "Madhepura",
        "expectedWinningParty": "RJD",
        "expectedVotes": 148000,
        "winningMargin": 18000,
        "runnerUpParty": "BJP",
        "runnerUpVotes": 130000
    },
    {
        "sno": 18,
        "district": "Supaul",
        "constituency": "Supaul",
        "expectedWinningParty": "JDU",
        "expectedVotes": 152000,
        "winningMargin": 22000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 19,
        "district": "Begusarai",
        "constituency": "Begusarai",
        "expectedWinningParty": "BJP",
        "expectedVotes": 165000,
        "winningMargin": 35000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 20,
        "district": "Khagaria",
        "constituency": "Khagaria",
        "expectedWinningParty": "JDU",
        "expectedVotes": 145000,
        "winningMargin": 15000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 21,
        "district": "Munger",
        "constituency": "Munger",
        "expectedWinningParty": "BJP",
        "expectedVotes": 158000,
        "winningMargin": 28000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 22,
        "district": "Lakhisarai",
        "constituency": "Lakhisarai",
        "expectedWinningParty": "JDU",
        "expectedVotes": 142000,
        "winningMargin": 12000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 23,
        "district": "Sheikhpura",
        "constituency": "Sheikhpura",
        "expectedWinningParty": "BJP",
        "expectedVotes": 148000,
        "winningMargin": 18000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 24,
        "district": "Nalanda",
        "constituency": "Nalanda",
        "expectedWinningParty": "RJD",
        "expectedVotes": 155000,
        "winningMargin": 25000,
        "runnerUpParty": "JDU",
        "runnerUpVotes": 130000
    },
    {
        "sno": 25,
        "district": "Nawada",
        "constituency": "Nawada",
        "expectedWinningParty": "BJP",
        "expectedVotes": 162000,
        "winningMargin": 32000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 26,
        "district": "Jamui",
        "constituency": "Jamui",
        "expectedWinningParty": "JDU",
        "expectedVotes": 145000,
        "winningMargin": 15000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 27,
        "district": "Jehanabad",
        "constituency": "Jehanabad",
        "expectedWinningParty": "RJD",
        "expectedVotes": 152000,
        "winningMargin": 22000,
        "runnerUpParty": "BJP",
        "runnerUpVotes": 130000
    },
    {
        "sno": 28,
        "district": "Arwal",
        "constituency": "Arwal",
        "expectedWinningParty": "BJP",
        "expectedVotes": 138000,
        "winningMargin": 8000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 29,
        "district": "Rohtas",
        "constituency": "Sasaram",
        "expectedWinningParty": "BJP",
        "expectedVotes": 165000,
        "winningMargin": 35000,
        "runnerUpParty": "RJD",
        "runnerUpVotes": 130000
    },
    {
        "sno": 30,
        "district": "Kaimur",
        "constituency": "Bhabua",
        "expectedWinningParty": "BJP",
        "expectedVotes": 158000,
        "winningMargin": 28000,
        "runnerUpParty": "Congress",
        "runnerUpVotes": 130000
    }
];
