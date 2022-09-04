export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);

    // 본문 전체를 별도 함수로 추출
    return result;

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance); // 얕은 복사 수행
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    // 포인트 적립
    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공
        if ('comedy' === aPerformance.play.type) {
            volumeCredits += Math.floor(aPerformance.audience / 5);
        }
        return volumeCredits;
    }

    // 값이 변경되지 않는 변수는 매개 변수로 전달
    function amountFor(aPerformance) {
        // let thisAmount > let result
        let result = 0;
        switch (aPerformance.play.type) {
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
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)

        }

        // 함수 안에서 값이 바뀌는 변수 반환
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}