let primes = [];
let run = false;
let rand = undefined;
export const calculatePrimes = (iterations, multiplier) => {
	run = true;
	while (run) {
		for (let i = 0; i < iterations; i++) {
			let candidate = i * (multiplier * Math.random());
			let isPrime = true;

			for (var c = 2; c <= Math.sqrt(candidate); ++c) {
				if (candidate % c === 0) {
					// not prime
					isPrime = false;
					break;
				}
			}
			if (isPrime) {
				primes.push(candidate);
			}
		}
		postMessage({ primes });
	}
};

export const getPrimes = () => {
	postMessage({ primes, run });
};

export const stopPrimes = () => {
	run = false;
	postMessage({ primes, run });
};

export const getRand1 = () => {
	if (rand === undefined) {
		rand = Math.random();
	}
	postMessage({ rand });
};

export const getRand2 = () => {
	if (rand === undefined) {
		rand = Math.random();
	}
	postMessage({ rand });
};
