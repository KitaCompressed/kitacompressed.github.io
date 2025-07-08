const handle = 'KitaCompressed';
const apiUrl = `https://codeforces.com/api/user.info?handles=${handle}`;

const cfUserName = document.getElementById('cfUserName');
const cfRank = document.getElementById('cfRank');
const cfRating = document.getElementById('cfRating');
const cfContestList = document.getElementById('cfContestList');
const cfSolvedCount = document.getElementById('cfSolvedCount');
const cfHeatmap = document.getElementById('cfHeatmap');

function getColorForRating(rating) {
    if (rating === null || rating === undefined) return '#000000'; // Unrated
    if (rating < 1200) return '#808080'; // Newbie
    if (rating < 1400) return '#008000'; // Pupil
    if (rating < 1600) return '#03A89E'; // Specialist
    if (rating < 1900) return '#0000FF'; // Expert
    if (rating < 2100) return '#AA00AA'; // Candidate Master
    if (rating < 2300) return '#FF8C00'; // Master
    if (rating < 2400) return '#FF8C00'; // International Master
    return '#FF0000'; // >= Grandmaster
}

function getDateStr(ts) {
    const d = new Date(ts * 1000);
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function getColorByCount(count) {
    if (count === 0) return '#ebedf0';
    if (count === 1) return '#c6e48b';
    if (count === 2) return '#7bc96f';
    if (count <= 4) return '#239a3b';
    return '#196127';
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
            const rating = user.rating ? user.rating : 0;

            cfRank.textContent = rank;
            cfUserName.textContent = handle;
            
            // 检查rating是否为有效数字
            if (rating && !isNaN(rating) && rating > 0) {
                cfRating.textContent = rating;
            } else {
                cfRating.textContent = 'Unrated';
            }

            cfRank.style.color = getColorForRating(rating);
            cfRating.style.color = getColorForRating(rating);
            cfUserName.style.color = getColorForRating(rating);
        }
    })
    .catch(error => {
        console.error('Error fetching CF user data:', error);
        cfRank.textContent = 'Error';
        cfRating.textContent = 'Error';
        cfUserName.textContent = handle;
    });

    // get contest list
    fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'OK' && cfContestList) {
            let html = '<ul>';
            data.result.forEach(contest => {
                html += `<li>${contest.contestName}, Rating: ${contest.oldRating} → ${contest.newRating}</li>`;
            });
            html += '</ul>';
            cfContestList.innerHTML = html;
        }
    });

    // get sloved problems
    fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'OK' && cfSolvedCount) {
            const submissions = data.result;
            const solvedSet = new Set();
            submissions.forEach(sub => {
                if (sub.verdict === 'OK') {
                    solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
                }
            });
            
            // 创建统计显示
            const solvedCount = solvedSet.size;
            cfSolvedCount.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Problems Solved</span>
                    <span class="stat-value">${solvedCount}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Submissions</span>
                    <span class="stat-value">${submissions.length}</span>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error fetching CF submissions:', error);
        if (cfSolvedCount) {
            cfSolvedCount.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Problems Solved</span>
                    <span class="stat-value">Error</span>
                </div>
            `;
        }
    });

    fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK' && cfHeatmap) {
            // per day
            const solvedPerDay = {};
            data.result.forEach(sub => {
                if (sub.verdict === 'OK') {
                    const dateStr = getDateStr(sub.creationTimeSeconds);
                    // 用题目唯一标识去重
                    const pid = `${sub.problem.contestId}-${sub.problem.index}`;
                    if (!solvedPerDay[dateStr]) solvedPerDay[dateStr] = new Set();
                    solvedPerDay[dateStr].add(pid);
                }
            });

            // per year
            const today = new Date();
            today.setHours(0,0,0,0);
            const days = [];
            for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - (364 - i));
                days.push(d);
            }

            // render heatmap
            let html = '<div style="display:flex">';
            for (let w = 0; w < 53; w++) { // 53周
                html += '<div style="display:flex;flex-direction:column;">';
                for (let d = 0; d < 7; d++) {
                    const idx = w * 7 + d;
                    if (idx >= days.length) break;
                    const dateStr = days[idx].toISOString().slice(0, 10);
                    const count = solvedPerDay[dateStr] ? solvedPerDay[dateStr].size : 0;
                    html += `<div title="${dateStr}: ${count}题" style="width:12px;height:12px;margin:1px;background:${getColorByCount(count)};border-radius:2px;"></div>`;
                }
                html += '</div>';
            }
            html += '</div>';
            cfHeatmap.innerHTML = html;

            // count problems solved
            let allSolvedSet = new Set();
            let yearSolvedSet = new Set();
            let monthSolvedSet = new Set();
            let weekSolvedSet = new Set();

            const now = new Date();
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);

            Object.keys(solvedPerDay).forEach(dateStr => {
                const day = new Date(dateStr);
                const set = solvedPerDay[dateStr];
                set.forEach(pid => {
                    allSolvedSet.add(pid);
                    if (day >= oneYearAgo) yearSolvedSet.add(pid);
                    if (day >= oneMonthAgo) monthSolvedSet.add(pid);
                    if (day >= oneWeekAgo) weekSolvedSet.add(pid);
                });
            });

            // put on console
            console.log('总题数:', allSolvedSet.size);
            console.log('近一年:', yearSolvedSet.size);
            console.log('近一月:', monthSolvedSet.size);
            console.log('近一周:', weekSolvedSet.size);

            if (cfSolvedCount) {
                cfSolvedCount.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-value">${allSolvedSet.size}</span>
                        <span class="stat-label">problems solved for all time</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${yearSolvedSet.size}</span>
                        <span class="stat-label">problems solved for the last year</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${monthSolvedSet.size}</span>
                        <span class="stat-label">problems solved for the last month</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${weekSolvedSet.size}</span>
                        <span class="stat-label">problems solved for the last week</span>
                    </div>
                `;
            }
        }
    });
} else {
    console.error('somthing wrong happened');
}
