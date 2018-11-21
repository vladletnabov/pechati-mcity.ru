<?
require_once "./contact_data.php";

$last_tr = false;
?>
<div>
<?
foreach ($contacts as $kpoint=>$vdata){
?>
	<div style="display: inline-block; width: 310px; border: 1px solid #ccc; margin: 10px;">
		<!-- содержание блока начало -->
		<p align="center"><b><? echo $vdata['header'];?></B><br><br>
		 <? echo $vdata['point'];?><br><? echo $vdata['address'];?><br><br> <font color="#ff0000"><strong><? echo $vdata['phone'];?></strong></font><br><br>
		 <noindex><a href="mailto:<? echo $vdata['email'];?>" target="_parent" class="standlink"><? echo $vdata['email'];?></a></noindex></p>
		<!-- содержание блока конец -->
	</div>
<?	
}
?>
</div>




