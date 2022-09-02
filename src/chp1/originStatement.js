export {myStatement}

function myStatement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    // Intl.NumberFormat : 숫자 서식을 지원하는 객체
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf);

        // 포인트 적립
        volumeCredits += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공
        if ('comedy' === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        // 청구 내역을 출력
        result += `  ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }

    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립 포인트: ${volumeCredits}점\n`;

    return result;

    /**
     * 아래는 중첩함수
     */

    // 값이 변경되지 않는 변수는 매개 변수로 전달
    function amountFor(aPerformance) {
        // let thisAmount > let result
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy": // 비극
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;

            case "comedy": // 희극
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;

            default:
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)

        }

        // 함수 안에서 값이 바뀌는 변수 반환
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}