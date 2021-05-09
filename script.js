const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

let lang = "";
const languages = { java: "java", cpp: "cpp", python: "py" };

let getTestCaseFromProblemHtml = (dir, html) => {
  if (!languages[lang.toLowerCase()]) return;
  fs.copyFileSync(`${dir}/../template.${languages[lang.toLowerCase()]}`, `${dir}/sol.${languages[lang.toLowerCase()]}`);
  data = [];
  const $ = cheerio.load(html);
  $('div.input pre').each((i, elem) => {
    data[i] = {
      ...data[i],
      input: $(elem).text()
    };
  });
  $('div.output pre').each((i, elem) => {
    data[i] = ({
      ...data[i],
      output: $(elem).text()
    });
  });
  console.log(data);
  data.forEach((test, i) => {
    fs.writeFile(`${dir}/in${i}.txt`, test.input, function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`The file ${dir}/in${i}.txt was saved!`);
    });
    fs.writeFile(`${dir}/out${i}.txt`, test.output, function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`The file ${dir}/out${i}.txt was saved!`);
    });
  })
  console.log(data);
}

function getTestCaseFromProblemUrl(url) {
  var dir = `./${url.substring(url.lastIndexOf('/') + 1)}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  axios.get(url)
    .then(response => {
      getTestCaseFromProblemHtml(dir, response.data);
    }
    )
    .catch(err => console.log(err));
}

let getTotalProblemsFromContestHtml = (html) => {
  data = [];
  const $ = cheerio.load(html);
  console.log('parsing');
  $('tr td.id a').each((i, elem) => {
    problem_url = 'https://codeforces.com/' + $(elem).attr('href')
    console.log(problem_url);
    getTestCaseFromProblemUrl(problem_url);
  });
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


readline.question('Enter contest URL and Programming language to be used -> ', (value) => {

  let arrInput = value.split(" ")
  let url = arrInput[0];git 
  lang = arrInput[1];
  console.log(url, lang);
  readline.close();
  axios.get(url)
    .then(response => {
      getTotalProblemsFromContestHtml(response.data);
    });

});


