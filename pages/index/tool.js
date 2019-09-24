const tools = {
    //反色
    anti: function (data, config, width, height) {
        const r = config.config.r.value
        for (var i = 0; i < data.length; i += 4) {
            const d1 = (255 - data[i]) * r
            const d2 = (255 - data[i+1]) * r
            const d3 = (255 - data[i+2]) * r

            data[i] = d1 > 255 ? 255 : d1
            data[i + 1] = d2 > 255 ? 255 : d2
            data[i + 2] = d3 > 255 ? 255 : d3
        }
        return data
    },
    //灰度
    grayscale: function (data, config, width, height) {
        const k = config.config.k.value
        const g = config.config.g.value
        const w = config.config.w.value

        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            // var avg = .299*data[i] + .587*data[i+1] + .114* data[i+2]
            // var avg = .2126*data[i] + .7152*data[i+1] + .0722* data[i+2]
            // var avg = .2627*data[i] + .6780*data[i+1] + .0593* data[i+2]
            // var avg = Math.min(data[i], data[i+1], data[i+2])
            avg = avg > k ? avg * w : avg * g
            data[i] = data[i + 1] = data[i + 2] = avg
        }
        return data
    },
    //浮雕
    statue: function (data, config, width, height) {
        const k = config.config.k.value
        const g = config.config.g.value
        const w = config.config.w.value

        for (var i = 0; i < data.length; i += 4) {
            const avg = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3)
            const index = i / 4
            const x = parseInt(index / width)
            const y = index % width

            const d_x = x + 1 > height ? height : x + 1
            const d_y = y + 1 > width ? width : y + 1
            const d_i = (d_x * width + d_y) * 4

            const d_avg = parseInt((data[d_i] + data[d_i + 1] + data[d_i + 2]) / 3)

            let s_avg = avg - d_avg + 128
            s_avg = s_avg > k ? s_avg * w : s_avg * g
            s_avg = s_avg > 255 ? 255 : s_avg < 0 ? 0 : s_avg
            data[i] = data[i + 1] = data[i + 2] = s_avg
        }
        return data
    },
    //像素化
    pixel: function (data, config, width, height) {
        const range = config.config.r.value
        const half_range = Math.ceil(range / 2)

        for (var i = 0; i < height; i += range) {
            for(var j = 0; j < width; j += range){
                const x = [i],y = [j]
                var r = 0,g = 0,b = 0
                for(var hr = 1; hr < half_range; hr++){
                    if(i- hr >= 0){
                        x.unshift(i- hr)
                    }
                    if (i + hr < height) {
                        x.push(i + hr)
                    }
                    if (j - hr >= 0) {
                        y.unshift(j - hr)
                    }
                    if (j + hr < width) {
                        y.push(j + hr)
                    }
                }

                for(var w = 0; w < x.length; w++){
                    for (var h = 0; h < y.length; h++) {
                        const pos = (x[w]*width + y[h])*4
                        r += data[pos]
                        g += data[pos+1]
                        b += data[pos+2]
                    }
                }
                const num = x.length*y.length
                for (var w = 0; w < x.length; w++) {
                    for (var h = 0; h < y.length; h++) {
                        const pos = (x[w] * width + y[h]) * 4
                        data[pos] = parseInt(r / num)
                        data[pos + 1] = parseInt(g / num)
                        data[pos + 2] = parseInt(b / num)
                    }
                }

            }
        }
        return data
    },
    //模糊
    vague: function (data, config, width, height) {
        const range = config.config.r.value
        const half_range = Math.ceil(range/2)
        for (var i = 0; i < height; i ++) {
            for(var j = 0; j < width; j ++){
                const x = [i],y = [j]
                var r = 0, g = 0, b = 0
                var pos = (i*width + j)*4

                for(var hr = 1; hr < half_range; hr++){
                    if(i- hr >= 0){
                        x.unshift(i- hr)
                    }
                    if (i + hr < height) {
                        x.push(i + hr)
                    }
                    if (j - hr >= 0) {
                        y.unshift(j - hr)
                    }
                    if (j + hr < width) {
                        y.push(j + hr)
                    }
                }

                for(var w = 0; w < x.length; w++){
                    for (var h = 0; h < y.length; h++) {
                        const pos = (x[w]*width + y[h])*4
                        r += data[pos]
                        g += data[pos+1]
                        b += data[pos+2]
                    }
                }

                const num = x.length * y.length

                data[pos] = parseInt(r / num)
                data[pos + 1] = parseInt(g / num)
                data[pos + 2] = parseInt(b / num)
            }
        }
        return data
    }
}


module.exports.tool = function (data, config, imgInfo){
    const name = config.value || 'statue'
    const width = imgInfo.width
    const height = imgInfo.height
    return tools[name](data, config, width, height)
}