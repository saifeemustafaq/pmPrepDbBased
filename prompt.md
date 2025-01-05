@app 


We are developing a website:
The website provides interview questions and answers which are fetched from mongodb. There are five Categories: Behavioral, Product Design, Strategy, Execution, Estimation.

Each category has sub categories as follows:

"Behavioral" 
- Achievement & Success
- Challenges & Problem-Solving  
- Interpersonal & Collaboration

"Product Design" 
- Product Analysis
- New Product Design
- Product Improvement

"Strategy" 
- Market Entry & Expansion
- Future Planning & Growth

"Execution"
- Metrics & Analysis  
- Root Cause Analysis

"Estimation"
- Market Size & Scale


There is a side bar on the left with the categories, within the box of each category tab, there is the question count x/y format. There is also a Progress bar that shows the progress of the user in the category. 

When the user clicks on a category, the questions are fetched from mongodb and displayed in the main content area. These questions are separated by sub categories. each sub category also has a question count x/y format and it's own progress bar.

The user can click on a question to view the answer. The answer is fetched from mongodb. The answer consists of "How to Answer" and "Example Answer". The content in the answer is formatted in markdown.

Each question has a checkbox to mark it as completed. When the user clicks on the checkbox, the question is marked as completed and the progress bar is updated as well as the question count.

for your reference this is what the object from MongoDB looks like:

{"_id":{"$oid":"67794a48d1d6bb3a4ad600cc"},"category":"Behavioral","subCategory":"Achievement & Success","question":"### Tell me about your proudest professional achievement. What was the impact, and how did you measure its success?","howToAnswer":"When answering this question about your proudest achievement at work, focus on showing your **skills** and the **impact** you made. Think about your career and choose an accomplishment that aligns well with the job you are applying for.\n\nA good way to begin your answer is with a statement like: \"One professional achievement I am particularly proud of is...\" This sets the stage for your story and immediately grabs the interviewer's attention.\n\nAs you describe your achievement, use the **STAR method** (*Situation, Task, Action, Result*) to structure your response. This will help you provide a clear and concise narrative that highlights your role and the impact of your work.\n\nTry to include **specific numbers** when you can. Numbers help show the real impact of what you did. If you don't have exact figures, use estimates or percentages to give a sense of scale.\n\nFor example, you might start with: \"One professional achievement I am particularly proud of is when I led a project to streamline our company's supply chain process. This initiative resulted in a 20% reduction in operational costs and improved delivery times by 30%.\"\n\nFinally, don't forget to reflect on what you **learned** from the experience and how it has shaped your approach to work. This shows self-awareness and a commitment to continuous improvement.\n","exampleAnswer":"\"One professional achievement I am particularly proud of is when I started a company-wide sustainability initiative at my previous job in the manufacturing sector.\n\nWhen I joined the company, I noticed that our waste management practices were outdated and inefficient, leading to high disposal costs and a negative environmental impact. I saw an opportunity to make a significant change that would benefit both the company and the environment.\n\nI proposed and led a **cross-functional team** to implement a comprehensive recycling and waste reduction program. This involved conducting a thorough waste audit, researching best practices in sustainable manufacturing, and developing partnerships with local recycling facilities.\n\nWe faced several challenges along the way, including resistance to change from some long-time employees and the initial costs of implementing new systems. However, by clearly communicating the long-term benefits and providing thorough training, we were able to get buy-in from all levels of the organization.\n\nThe **impact** of this initiative was substantial. Within the first year, we reduced our landfill waste by 60% and increased our recycling rate from 15% to 75%. This helped us cut costs by $500,000 annually in waste disposal fees. Additionally, we saw a 10% increase in employee satisfaction scores, with many citing the company's commitment to sustainability as a key factor.\n\nTo track how well it was working, we set up a **monitoring system** that monitored our waste output, recycling rates, and associated costs on a monthly basis. We also conducted quarterly employee surveys to gauge engagement and gather suggestions for further improvements.\n\nThis achievement not only had a positive impact on the company's bottom line and environmental footprint, but it also showed we were an industry leader in sustainable manufacturing practices. We received recognition from local environmental agencies and even won a regional award for corporate sustainability.\n\nThe experience taught me the importance of thinking holistically about business processes, the power of effective change management, and the value of measuring and communicating results. These are skills I am excited to bring to this new role and apply to drive similar impactful initiatives.\"","createdAt":{"$date":{"$numberLong":"1736002120137"}},"updatedAt":{"$date":{"$numberLong":"1736006989588"}}}


Keep the code modular, and use the best practices to develop this application