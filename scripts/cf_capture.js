const handle = 'KitaCompressed';
const apiUrl = `https://codeforces.com/api/user.info?handles=${handle}`;

const cfUserName = document.getElementById('cfUserName');
const cfRank = document.getElementById('cfRank');
const cfRating = document.getElementById('cfRating');

function getColorForRating(rating) {
    if (rating === null || rating === undefined) return '#000000'; // Unrated
    if (rating < 1200) return '#808080'; // Newbie (灰色)
    if (rating < 1400) return '#008000'; // Pupil (绿色)
    if (rating < 1600) return '#03A89E'; // Specialist (青色)
    if (rating < 1900) return '#0000FF'; // Expert (蓝色)
    if (rating < 2100) return '#AA00AA'; // Candidate Master (紫色)
    if (rating < 2300) return '#FF8C00'; // Master (橙色)
    if (rating < 2400) return '#FF8C00'; // International Master (橙色)
    // if (rating < 2600) return '#FF0000'; // Grandmaster (红色)
    // if (rating < 3000) return '#FF0000'; // International Grandmaster (红色)
    return '#FF0000'; // Legendary Grandmaster (红色) - 简化处理
}

if(cfRank && cfRating && cfUserName) {
    fetch(apiUrl) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if(data.status === 'OK') {
            const user = data.result[0];
            const rank = user.rank ? user.rank : 'Unranked';
            const rating = user.rating ? user.rating : 'Unrated';

            cfRank.textContent = rank;
            cfUserName.textContent = handle;
            cfRating.textContent = `Contest Rating: ${rating}`;

            cfRank.style.color = getColorForRating(rating);
            cfRating.style.color = getColorForRating(rating);
            cfUserName.style.color = getColorForRating(rating);
        }
    })
} else {
    console.error('somthing wrong happened');
}
