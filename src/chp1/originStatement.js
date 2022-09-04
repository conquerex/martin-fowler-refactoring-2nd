export {myStatement}

function myStatement(invoice, plays) {
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    for (let perf of invoice.performances) {
        // 청구 내역을 출력
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(totalAmount())}\n`;
    // 변수 인라인
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;

    return result;

    /**
     * 아래는 중첩함수
     */
    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {style : "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100); // 단위 변환도 이쪽으로 옮김
    }

    // 포인트 적립
    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공
        if ('comedy' === playFor(aPerformance).type) {
            volumeCredits += Math.floor(aPerformance.audience / 5);
        }
        return volumeCredits;
    }

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