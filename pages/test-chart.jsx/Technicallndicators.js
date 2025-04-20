export function calcRSI(data, period = 14) {
    const rsi = []
    let gain = 0, loss = 0
  
    for (let i = 1; i <= period; i++) {
      const diff = data[i].close - data[i - 1].close
      if (diff >= 0) gain += diff
      else loss -= diff
    }
  
    let avgGain = gain / period
    let avgLoss = loss / period
    rsi.push({
      time: data[period].time,
      value: 100 - 100 / (1 + avgGain / (avgLoss || 1)),
    })
  
    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i].close - data[i - 1].close
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period
        avgLoss = (avgLoss * (period - 1)) / period
      } else {
        avgGain = (avgGain * (period - 1)) / period
        avgLoss = (avgLoss * (period - 1) - diff) / period
      }
      const rs = avgGain / (avgLoss || 1)
      rsi.push({
        time: data[i].time,
        value: 100 - 100 / (1 + rs),
      })
    }
  
    return rsi
  }
  
  export function calcMACD(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const ema = (arr, period) => {
      const k = 2 / (period + 1)
      let emaArr = [arr[0].close]
      for (let i = 1; i < arr.length; i++) {
        emaArr.push(arr[i].close * k + emaArr[i - 1] * (1 - k))
      }
      return emaArr
    }
  
    const shortEMA = ema(data, shortPeriod)
    const longEMA = ema(data, longPeriod)
    const macdLine = shortEMA.map((val, i) => val - longEMA[i])
    const signalLine = ema(macdLine.map((v, i) => ({ close: v || 0 })), signalPeriod)
    const histogram = macdLine.map((v, i) => v - signalLine[i])
  
    return data.map((d, i) => ({
      time: d.time,
      macd: macdLine[i],
      signal: signalLine[i],
      histogram: histogram[i],
    }))
  }
  
  export function calcBollinger(data, period = 20, multiplier = 2) {
    const bb = []
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1)
      const avg = slice.reduce((sum, d) => sum + d.close, 0) / period
      const std = Math.sqrt(slice.reduce((sum, d) => sum + Math.pow(d.close - avg, 2), 0) / period)
  
      bb.push({
        time: data[i].time,
        upper: avg + multiplier * std,
        lower: avg - multiplier * std,
        basis: avg,
      })
    }
  
    return bb
  }
  