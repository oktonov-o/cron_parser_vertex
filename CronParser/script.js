const form = document.getElementById('cronForm');
const textInput = document.getElementById('cronInput');

form.addEventListener('submit', parseCronExpression);

function parseCronExpression(e) {
    e.preventDefault();

    const cronTextArr = textInput.value.split(' ');
    const MINUTE = cronTextArr[0];
    const HOUR = cronTextArr[1];
    const DAY_OF_MONTH = cronTextArr[2];
    const MONTH = cronTextArr[3];
    const DAY_OF_WEEK = cronTextArr[4];
    const COMMAND = cronTextArr[5];

    document.getElementById('minute').innerHTML = parser(MINUTE, 0, 59);
    document.getElementById('hour').innerHTML = parser(HOUR, 0, 23);
    document.getElementById('dayOfMonth').innerHTML = parser(DAY_OF_MONTH, 1, 31);
    document.getElementById('month').innerHTML = parser(MONTH, 1, 12);
    document.getElementById('dayOfWeek').innerHTML = parser(DAY_OF_WEEK, 1, 7);
    document.getElementById('command').innerHTML = COMMAND;
}

function parser(text, start, end) {
    const result = [];

    //case when text is '*'
    if (text === "*") {
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result.join(' ');
    }

    //case when text is a single number
    if (/^\d+$/.test(text)) {
        const value = parseInt(text, 10);
        if (value >= start && value <= end) {
            return value;
        }
        return 'invalid text';
    }

    //case when text is separated with '/'
    if (/^\*\/\d+$/.test(text) || /^\d+-\d+\/\d+$/.test(text)) {
        const [range, step] = text.split('/');
        const h = parseInt(step, 10);
        let minimum = start;
        let maximum = end;

        if (range !== '*') {
            minimum = parseInt(range.split('-')[0], 10);
            maximum = parseInt(range.split('-')[1], 10);
        }

        if(h === 0) return 'invalid text';

        for (let i = minimum; i <= maximum; i += h) {
            result.push(i);
        }
        return result.join(' ');
    }

    //case when text is separated with ','
    if (/^[\d,]*$/.test(text)) {
        text.split(',')
            .map(
                value => {
                    if (value >= start && value <= end && !result.includes(value)) {
                        result.push(value);
                    }
                })
		return result.sort((a, b) => parseInt(a, 10) >= parseInt(b, 10) ? 1 : -1).join(' ');
    }

	//case when text is separated with '-'
    if (/^\d+-\d+$/.test(text)) {
        const range = text.split("-");
        const minimum = parseInt(range[0], 10);
        const maximum = parseInt(range[1], 10);

        for (let i = minimum; i <= maximum; i++) {
            if (i >= start && i <= end && !result.includes(i)) {
                result.push(i);
            }
        }
		return result.join(' ');
    }

    return 'invalid text';
}
