/* eslint-disable no-tabs */
const codeSamples = {
  c: `int main()
{
    int a[10], n, i, j, temp;
    float mean, median;

    printf("Enter no. for Random Numbers :");
    scanf("%d", &n);
    for (i = 0; i < n; i++)
    {
        a[i] = rand() % 100;
    }
    printf("Random Numbers Generated are :\n");
    for (i = 0; i < n; i++)
    {
        printf("\n%d", a[i]);
    }
    printf("\n");
    printf("\nSorted Data:");
    for (i = 0; i < n; i++)
    {
        for (j = 0; j < n; j++)
        {
            if (a[i] < a[j])
            {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
    for (i = 0; i < n; i++)
    {
        printf("\n%d", a[i]);
    }

    if (n % 2 == 0)
    {
        median = (a[n / 2] + a[(n / 2) - 1]) / 2;
    }
    else
    {
        median = a[n / 2];
    }
    printf("\nMedian is : %f", median);

    return 0;
}`,
  cpp: `int main (int argc, char const *argv[]) {
	const int MAX_ELEMENTS = 10;
	int list[MAX_ELEMENTS];
	for(int i = 0; i < MAX_ELEMENTS; i++ ){
		list[i] = rand()%100;
	}
	printf("The list before sorting is:\n");
	printlist(list,MAX_ELEMENTS);

	alg::BubbleSort(list,0,MAX_ELEMENTS-1);

	printf("The list after sorting using bubble-sort algorithm:\n");
	printlist(list,MAX_ELEMENTS);

	return 0;
}`,
  java: `public class Naive_String_Searching {
	public static void main(String[] args) throws Exception{
		long start = System.nanoTime();

		String txt = "awefdwefwfef";
		String pat = "fwef";

		boolean ans = naive(pat, txt);
		System.out.println(ans);
		System.out.println("\n"+((System.nanoTime()-start)*1E-6)+" ms");

	}

	public static boolean naive(String pat, String txt){
		boolean contains = false;
		for(int i=0;i<=txt.length() - pat.length();i++){
			contains = txt.substring(i, i+pat.length()).equals(pat);
			if(contains) return true;
		}
		return false;
	}
}`,
  python: `
def polar_force(
    magnitude: float, angle: float, radian_mode: bool = False
) -> list[float]:
    if radian_mode:
        return [magnitude * cos(angle), magnitude * sin(angle)]
    return [magnitude * cos(radians(angle)), magnitude * sin(radians(angle))]


def in_static_equilibrium(
    forces: NDArray[float64], location: NDArray[float64], eps: float = 10**-1
) -> bool:
    moments: NDArray[float64] = cross(location, forces)
    sum_moments: float = sum(moments)
    return abs(sum_moments) < eps


if __name__ == "__main__":
    forces = array(
        [
            polar_force(718.4, 180 - 30),
            polar_force(879.54, 45),
            polar_force(100, -90),
        ]
    )

    location: NDArray[float64] = array([[0, 0], [0, 0], [0, 0]])
    assert in_static_equilibrium(forces, location)
    forces = array(
        [
            polar_force(30 * 9.81, 15),
            polar_force(215, 180 - 45),
            polar_force(264, 90 - 30),
        ]
    )

    location = array([[0, 0], [0, 0], [0, 0]])

    assert in_static_equilibrium(forces, location)
    forces = array([[0, -2000], [0, -1200], [0, 15600], [0, -12400]])
    location = array([[0, 0], [6, 0], [10, 0], [12, 0]])
    assert in_static_equilibrium(forces, location)

    import doctest

    doctest.testmod()`,
  cs: `namespace SearchAlgorithms
{
    public static class LinearSearchClass
    {
        public static int? LinearSearch(this int[] array, int key)
        {
            foreach (var item in array)
            {
                if (item == key)
                    return item;
            }

            return null;
        }
    }
}`,
  typescript: `export function maxCrossSubarray(
  input: number[],
  start: number,
  mid: number,
  end: number
): { start: number; end: number; sum: number } {
  let leftIndex = -1;
  let leftMaxSum = -Infinity;
  let sum = 0;

  reverseRange(mid, start).forEach(index => {
    sum += input[index];
    if (sum > leftMaxSum) {
      leftMaxSum = sum;
      leftIndex = index;
    }
  });

  let rightIndex = -1;
  let rightMaxSum = -Infinity;
  sum = 0;
  range(mid + 1, end).forEach(index => {
    sum += input[index];
    if (sum > rightMaxSum) {
      rightMaxSum = sum;
      rightIndex = index;
    }
  });

  return {
    start: leftIndex,
    end: rightIndex,
    sum: leftMaxSum + rightMaxSum,
  };
}

export function maxSubarray(
  input: number[],
  start: number,
  end: number
): { start: number; end: number; sum: number } {
  if (end - start === 0) return { start, end, sum: input[start] };

  const mid = Math.floor((start + end) / 2);
  const leftMax = maxSubarray(input, start, mid);
  const rightMax = maxSubarray(input, mid + 1, end);
  const crossMax = maxCrossSubarray(input, start, mid, end);

  if (leftMax.sum >= rightMax.sum && leftMax.sum >= crossMax.sum) {
    return leftMax;
  } else if (rightMax.sum >= leftMax.sum && rightMax.sum >= crossMax.sum) {
    return rightMax;
  } else {
    return crossMax;
  }
}`,
  javascript: `const binarySearch = (nums, target) => {
  let left = 0
  let right = nums.length - 1
  let mid

  const getMiddle = () => {
    return Math.round((right - left) / 2 + left)
  }

  while (left <= right) {
    mid = getMiddle()
    if (nums[mid] === target) {
      return mid
    } else if (target < nums[mid]) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return -1
}`,
  ruby: `
  def sum_eq_n?(arr, n)
  return true if arr.empty? && n == 0
  arr.product(arr).reject { |a,b| a == b }.any? { |a,b| a + b == n }
end
`
}

export { codeSamples }
