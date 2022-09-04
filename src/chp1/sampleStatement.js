export {myStatement}
import createStatementData from "./sampleCreateStatementData.js";

function myStatement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style : "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100); // 단위 변환도 이쪽으로 옮김
}

function renderPlainText(data, plays) {
    // 고객명을 data에서 얻어오도록 한다
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        // 청구 내역을 출력
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(data.totalAmount)}\n`;
    // 변수 인라인
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;

    return result;
}

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>`;
    result += `<table>`;
    result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>`;
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>`;
    }
    result += `</table>`;
    result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>`;
    result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>`;
    return result;
}