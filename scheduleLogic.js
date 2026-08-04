// Function sagantaan yoo wal-irra bu'e ykn walitti aane sirreessu
export const generateValidSchedule = (classesList) => {
  // Yeroon dursaa akka dhufu qindeessuu
  let sortedClasses = classesList.sort((a, b) => a.startTime - b.startTime);
  let finalSchedule = [];

  for (let i = 0; i < sortedClasses.length; i++) {
    let currentClass = sortedClasses[i];

    if (finalSchedule.length > 0) {
      let previousClass = finalSchedule[finalSchedule.length - 1];
      
      // Yoo sagantaan wal-irra bu'e (Overlapping)
      if (currentClass.startTime < previousClass.endTime) {
        currentClass.startTime = previousClass.endTime;
        currentClass.endTime = currentClass.startTime + currentClass.duration;
      }
      
      // Yoo barsiisaan tokko walitti aansee kutaa qabaate (Consecutive check)
      if (currentClass.teacherName === previousClass.teacherName) {
        // Daqiiqaa 15 aara galfii (break) gidduutti ofiinsaa dabala
        currentClass.startTime += 15; 
        currentClass.endTime += 15;
      }
    }
    finalSchedule.push(currentClass);
  }
  
  return finalSchedule;
};
