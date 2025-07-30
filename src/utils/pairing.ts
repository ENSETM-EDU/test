export function generatePairs(members: string[]): [string, string][] {
  let workingMembers = [...members];
  
  // Handle odd number by adding a different random member (not the same one)
  if (workingMembers.length % 2 !== 0) {
    // If we have only 1 member, we can't create pairs
    if (workingMembers.length === 1) {
      return [];
    }
    
    // Add a random member to make even count
    const randomIndex = Math.floor(Math.random() * workingMembers.length);
    workingMembers.push(workingMembers[randomIndex]);
  }

  // Shuffle the array
  for (let i = workingMembers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [workingMembers[i], workingMembers[j]] = [workingMembers[j], workingMembers[i]];
  }

  // Create pairs, ensuring no self-pairing
  const pairs: [string, string][] = [];
  for (let i = 0; i < workingMembers.length; i += 2) {
    const member1 = workingMembers[i];
    const member2 = workingMembers[i + 1];
    
    // If we have a self-pair, try to fix it by swapping with next available member
    if (member1 === member2) {
      // Try to find a different member to pair with
      let swapped = false;
      for (let j = i + 2; j < workingMembers.length; j += 2) {
        if (workingMembers[j] !== member1 && workingMembers[j + 1] !== member1) {
          // Swap to avoid self-pairing
          [workingMembers[i + 1], workingMembers[j]] = [workingMembers[j], workingMembers[i + 1]];
          swapped = true;
          break;
        }
      }
      
      // If we couldn't swap, regenerate the entire array
      if (!swapped) {
        return generatePairs(members); // Recursive call to try again
      }
    }
    
    pairs.push([workingMembers[i], workingMembers[i + 1]]);
  }

  return pairs;
}

export function hasPairBeenUsed(pair: [string, string], usedPairs: string[][]): boolean {
  return usedPairs.some(([a, b]) => 
    (a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])
  );
}

export function areAllCombinationsUsed(members: string[], usedPairs: string[][]): boolean {
  const totalCombinations = (members.length * (members.length - 1)) / 2;
  const uniquePairs = new Set();
  
  usedPairs.forEach(([a, b]) => {
    const sorted = [a, b].sort();
    uniquePairs.add(`${sorted[0]}-${sorted[1]}`);
  });
  
  return uniquePairs.size >= totalCombinations;
}

export function formatGroupList(pairs: [string, string][]): string {
  const header = "قائمة الإستظهار :\n";
  const pairsList = pairs.map(([name1, name2]) => `${name1} - ${name2}`).join('\n');
  return header + pairsList;
}